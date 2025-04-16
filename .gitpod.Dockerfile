FROM gitpod/workspace-full

# Installa Node.js LTS
RUN bash -c 'VERSION="18" \
    && source $HOME/.nvm/nvm.sh \
    && nvm install $VERSION \
    && nvm use $VERSION \
    && nvm alias default $VERSION'

# Installa utility globali
RUN npm install -g npm@latest vite typescript

# Aggiorna pacchetti e installa dipendenze per lavorare con immagini
USER root
RUN apt-get update \
    && apt-get install -y libvips-dev

# Torna all'utente gitpod
USER gitpod 