import { eventBus } from '../main';

// Interfacce
export interface User {
  id: string | number;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Servizio di autenticazione
class AuthService {
  private user: User | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiration: number | null = null;
  private refreshTimer: number | null = null;

  constructor() {
    this.loadFromStorage();
  }

  // Carica dati da localStorage
  private loadFromStorage(): void {
    try {
      const userData = localStorage.getItem('user');
      const tokenData = localStorage.getItem('auth_token');
      const refreshData = localStorage.getItem('refresh_token');
      const expirationData = localStorage.getItem('token_expiration');

      if (userData) {
        this.user = JSON.parse(userData);
      }

      if (tokenData) {
        this.token = tokenData;
      }

      if (refreshData) {
        this.refreshToken = refreshData;
      }

      if (expirationData) {
        this.tokenExpiration = parseInt(expirationData, 10);
        this.setupRefreshTimer();
      }
    } catch (e) {
      console.error('Errore nel caricamento dei dati di autenticazione', e);
      this.logout();
    }
  }

  // Salva dati in localStorage
  private saveToStorage(): void {
    if (this.user) {
      localStorage.setItem('user', JSON.stringify(this.user));
    } else {
      localStorage.removeItem('user');
    }

    if (this.token) {
      localStorage.setItem('auth_token', this.token);
    } else {
      localStorage.removeItem('auth_token');
    }

    if (this.refreshToken) {
      localStorage.setItem('refresh_token', this.refreshToken);
    } else {
      localStorage.removeItem('refresh_token');
    }

    if (this.tokenExpiration) {
      localStorage.setItem('token_expiration', this.tokenExpiration.toString());
    } else {
      localStorage.removeItem('token_expiration');
    }
  }

  // Imposta il timer per refresh token
  private setupRefreshTimer(): void {
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
    }

    if (!this.tokenExpiration) return;

    const now = Date.now();
    const expirationTime = this.tokenExpiration;
    const timeUntilExpiry = expirationTime - now;

    // Aggiorna il token 5 minuti prima della scadenza
    const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

    if (refreshTime <= 0) {
      // Token già scaduto o in scadenza
      this.refreshAuthToken();
      return;
    }

    this.refreshTimer = window.setTimeout(() => {
      this.refreshAuthToken();
    }, refreshTime);
  }

  // Metodo per refreshare il token
  private async refreshAuthToken(): Promise<void> {
    if (!this.refreshToken) {
      this.logout();
      return;
    }

    try {
      // Qui implementare la chiamata API reale per il refresh token
      const response = await this.mockRefreshToken();
      
      this.setSession(response);
      eventBus.emit('auth:token-refreshed', this.token);
    } catch (error) {
      console.error('Errore durante il refresh del token', error);
      this.logout();
      eventBus.emit('auth:error', 'Sessione scaduta, effettua nuovamente il login');
    }
  }

  // Mock per il refresh token (da sostituire con API reali)
  private async mockRefreshToken(): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      // Simula una chiamata API
      setTimeout(() => {
        if (!this.user) {
          reject(new Error('User not found'));
          return;
        }
        
        const expiresAt = Date.now() + 60 * 60 * 1000; // 1 ora
        
        resolve({
          user: this.user,
          token: `refreshed_token_${Date.now()}`,
          refreshToken: `refreshed_refresh_token_${Date.now()}`,
          expiresAt
        });
      }, 300);
    });
  }

  // Imposta i dati della sessione
  private setSession(authResult: AuthResponse): void {
    this.user = authResult.user;
    this.token = authResult.token;
    this.refreshToken = authResult.refreshToken || null;
    this.tokenExpiration = authResult.expiresAt || null;
    
    this.saveToStorage();
    this.setupRefreshTimer();
  }

  // Mock per login (da sostituire con API reali)
  async login(email: string, password: string): Promise<User> {
    try {
      // Simula una chiamata API (sostituire con fetch reale)
      const response = await new Promise<AuthResponse>((resolve, reject) => {
        setTimeout(() => {
          if (email && password) {
            const expiresAt = Date.now() + 60 * 60 * 1000; // 1 ora
            resolve({
              user: {
                id: '123',
                name: 'Utente Demo',
                email: email,
                role: 'user'
              },
              token: `token_${Date.now()}`,
              refreshToken: `refresh_token_${Date.now()}`,
              expiresAt
            });
          } else {
            reject(new Error('Credenziali non valide'));
          }
        }, 500);
      });
      
      this.setSession(response);
      eventBus.emit('auth:login', this.user);
      
      if (!this.user) {
        throw new Error("Errore durante il login: utente non disponibile");
      }
      
      return this.user;
    } catch (error) {
      console.error('Errore durante il login', error);
      throw error;
    }
  }

  // Registrazione utente
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      // Simula una chiamata API (sostituire con fetch reale)
      const response = await new Promise<AuthResponse>((resolve, reject) => {
        setTimeout(() => {
          if (name && email && password) {
            const expiresAt = Date.now() + 60 * 60 * 1000; // 1 ora
            resolve({
              user: {
                id: `user_${Date.now()}`,
                name: name,
                email: email,
                role: 'user'
              },
              token: `token_${Date.now()}`,
              refreshToken: `refresh_token_${Date.now()}`,
              expiresAt
            });
          } else {
            reject(new Error('Dati non validi'));
          }
        }, 500);
      });
      
      this.setSession(response);
      eventBus.emit('auth:register', this.user);
      
      if (!this.user) {
        throw new Error("Errore durante la registrazione: utente non disponibile");
      }
      
      return this.user;
    } catch (error) {
      console.error('Errore durante la registrazione', error);
      throw error;
    }
  }

  // Logout
  logout(): void {
    this.user = null;
    this.token = null;
    this.refreshToken = null;
    this.tokenExpiration = null;
    
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    this.saveToStorage();
    eventBus.emit('auth:logout');
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    return !!this.user && !!this.token;
  }

  // Verifica se il token è scaduto
  isTokenExpired(): boolean {
    if (!this.tokenExpiration) return true;
    return Date.now() >= this.tokenExpiration;
  }

  // Ottieni utente corrente
  getCurrentUser(): User | null {
    return this.user;
  }

  // Ottieni token per chiamate API
  getToken(): string | null {
    return this.token;
  }

  // Ottieni ruolo utente
  getUserRole(): string | null {
    return this.user?.role || null;
  }
}

// Esporta istanza singleton
export const authService = new AuthService(); 