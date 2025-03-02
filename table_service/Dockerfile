FROM python:3.13.1-alpine3.20

# Atualizar pacotes e instalar dependências necessárias no Alpine
RUN apk add --no-cache \
    build-base \
    cmake \
    jpeg-dev \
    libpng-dev \
    tiff-dev \
    ffmpeg \
    libv4l \
    x264-dev \
    gtk+3.0-dev \
    lapack-dev \
    gfortran \
    musl-dev \
    pkgconf

# Instalar pip e OpenCV
RUN pip install --no-cache-dir opencv-python-headless numpy

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar os arquivos do projeto para o contêiner
COPY . /app

# Comando padrão ao rodar o contêiner
CMD ["python", "main.py"]