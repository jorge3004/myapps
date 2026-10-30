FROM octoprint/octoprint as dev
RUN apt-get update
RUN apt-get install nano
RUN pip install "https://github.com/kantlivelong/OctoPrint-PSUControl/archive/master.zip"
WORKDIR /octoprint/octoprint/plugins/OctoPrint-Jir3d
# RUN mkdir -p ./sjsj
COPY ./OctoPrint-Jir3d .
RUN pip install --upgrade pip
RUN octoprint dev plugin:install

