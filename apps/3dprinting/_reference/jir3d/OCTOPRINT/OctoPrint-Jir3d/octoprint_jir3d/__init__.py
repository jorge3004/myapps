from __future__ import absolute_import
import requests
import json
import time
import threading
import os
import platform
import octoprint.plugin

sleepTime = 2
sleepTimeBeforePrint = 8

class Jir3dPlugin(
    octoprint.plugin.SettingsPlugin,
    octoprint.plugin.AssetPlugin,
    octoprint.plugin.TemplatePlugin,
    octoprint.plugin.StartupPlugin,
):
    def __init__(self):
        self.hilo = None
        # self.checkHilo = threading.Event()

    def on_after_startup(self):
        self._logger.info("Hello World2! (more: %s)" % self._settings.get(["url"]))
        self.hilo = threading.Thread(target=self.paralelo)
        # self.hilo.daemon = True
        self.hilo.start()

    # ~~ SettingsPlugin mixin
    def get_settings_defaults(self):
        return dict(nombre="nombre_jir3d", jir3dAPI="https://api.jir3d.com")
        # return {
        #     # put your plugin's default settings here
        # }

    def get_template_configs(self):
        return [
            dict(type="navbar", custom_bindings=False),
            dict(type="settings", custom_bindings=False)
        ]
        # ~~ AssetPlugin mixin

    def get_assets(self):
        # Define your plugin's asset files to automatically include in the
        # core UI here.
        return {
            "js": ["js/jir3d.js"],
            "css": ["css/jir3d.css"],
            "less": ["less/jir3d.less"]
        }

    def get_template_vars(self):
        return dict(
            url=self._settings.get(["url"]),
            nombre=self._settings.get(["nombre"]),
            jir3dAPI=self._settings.get(["jir3dAPI"])
        )
    # ~~ Softwareupdate hook

    def get_update_information(self):
        # Define the configuration for your plugin to use with the Software Update
        # Plugin here. See https://docs.octoprint.org/en/master/bundledplugins/softwareupdate.html
        # for details.
        return {
            "jir3d": {
                "displayName": "Jir3d Plugin",
                "displayVersion": self._plugin_version,

                # version check: github repository
                "type": "github_release",
                "user": "jorge3004",
                "repo": "OctoPrint-Jir3d",
                "current": self._plugin_version,

                # update method: pip
                "pip": "https://github.com/jorge3004/OctoPrint-Jir3d/archive/{target_version}.zip",
            }
        }

    # def paralelo(self):
        while True:
            st = time.time()
            global test
            global impresoraLocalOcto
            global localPrinter
            global localPrinterUrlOcto
            global headers
            global printerApiJir3d
            global rawRespPrinterApiJir3d
            global jsonRespPrinterApiJir3d
            global responsePut
            global responsePutJson
            global isActive
            global completeName
            global file1
            global files
            global nameF
            global resp
            printerName = self._settings.get(["nombre"])
            printerAPI = self._settings.get(["apikey"])
            jir3dAPI = self._settings.get(["jir3dAPI"])
            headers = {'Authorization': 'Bearer ' + printerAPI}
            printerApiJir3d = jir3dAPI+"/impresoras/"+printerName
            apiJir3dBroadCast = jir3dAPI+"/broadcast/"+printerName
            apiJir3dFiles= jir3dAPI+"/files/"
            apiJir3dRepositorio= jir3dAPI+"/files/repositorio/"
            localPrinterUrlOcto = "http://localhost:5000/api/connection"
            impresoraLocalOcto = Impresora(printerName, printerAPI)

            files = ["afterPrintDone","afterPrintPaused", "beforePrintResumed"]

            # for file in files:
            #     completeName = Impresora().scriptsDir+file
            #     if os.path.isfile(completeName):
            #         print("File exists")
            #     else:
            #         print("Does not exist")
            #         nameF = jir3dAPI+"/scripts.php?file="+file
            #         resp = requests.get(nameF)
            #         file1 = open(completeName, "w")
            #         file1.write(resp.text)
            #         file1.close()
            #         # print(resp.status_code)
            
            # print(os.environ.get('NODE_PUBLISHED_PORT'))
            # print(os.environ.get('GATEWAY_IP'))
            # print(printerApiJir3d)
            if (printerName != 'nombre_jir3d'):   
                try:
                    localPrinter = requests.request("GET", localPrinterUrlOcto, headers=headers)
                except ValueError:
                        print(ValueError)
                        print("Error with __" + localPrinterUrlOcto+"__ get request")
                else:
                    try:
                        rawRespPrinterApiJir3d = requests.get(printerApiJir3d)
                    except ValueError:
                        print(ValueError)
                        print("Error with __" +printerApiJir3d + "__ get request")
                    else:
                        try:
                            jsonRespPrinterApiJir3d = json.loads(rawRespPrinterApiJir3d.text)
                        except:
                            print("Error with converting to json __" + printerApiJir3d)
                            print("Msj __" + rawRespPrinterApiJir3d.text)
                        else:
                            try:
                                jsonRespPrinterApiJir3d['isActive']
                            except ValueError:
                                print(ValueError)
                                print("impresora-isActive No definida, activandola en False")
                            else:
                                isActive = jsonRespPrinterApiJir3d['isActive']
                                if (isActive):
                                    data = {}
                                    data['_octoprint_API'] = {
                                        "uReporte": int(round(time.time())),
                                        "connection": impresoraLocalOcto.status(),
                                        "printerState": impresoraLocalOcto.printerStatus(),
                                        "printProgress": json.loads(impresoraLocalOcto.getPrintProgress().text),
                                    }
                                    try:
                                        responsePut = requests.post(apiJir3dBroadCast,
                                            headers={
                                                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
                                            },
                                            json=data
                                        )
                                    except:
                                        print("Error en post broadcast request"+apiJir3dBroadCast)
                                    else:
                                        try:
                                            responsePutJson = json.loads(responsePut.text)
                                            # responsePutJson = json.loads(responsePut.text.replace("\\r", ""))
                                        except:
                                            print("Error convirtiendo put response a Json")
                                        else:
                                            try:
                                                responsePutJson['comando']
                                            except:
                                                print("No existe comando en put response")
                                            else:
                                                comando = responsePutJson['comando']
                                                print(comando)
                                                if (comando == "nivelar" or comando == "imprimir"):
                                                    if (not os.path.isfile(Impresora().scriptsDir+"afterPrintCancelled")):
                                                        try:
                                                            resp = requests.get(apiJir3dFiles+"scripts/afterPrintCancelled")
                                                        except:
                                                            print("No existe gcodeCript in Server")
                                                        else:
                                                            print("saving afterPrintCancelled File")
                                                            localFile = open(Impresora().scriptsDir+"afterPrintCancelled", "w")
                                                            localFile.write(resp.text)
                                                            localFile.close()
                                                    if (comando == "nivelar"):
                                                        try:
                                                            resp = requests.get(apiJir3dFiles+"gcodes/nivelar/"+printerName)
                                                        except:
                                                            print("no se recibió nivelar gcode file")
                                                        else:
                                                            try:
                                                                completeName = Impresora().updatesDir+"nivelar.gcode"
                                                                # completeName = os.path.join(Impresora().updatesDir, "nivelar.gcode")
                                                                file1 = open(completeName, "w")
                                                            except:
                                                                print("La ruta para guardar archivo __ "+Impresora().updatesDir+" __no es valida")
                                                            else:
                                                                for file in files:
                                                                    completePath = Impresora().scriptsDir+file
                                                                    if (os.path.isfile(completePath)):
                                                                        os.remove(completePath)
                                                                file1.write(resp.text)
                                                                file1.close()
                                                                impresoraLocalOcto.turnPsuOn()
                                                                time.sleep(sleepTimeBeforePrint)
                                                                impresoraLocalOcto.nivelar()
                                                    elif (comando == "imprimir"):
                                                        for file in files:
                                                            completePath = Impresora().scriptsDir+file
                                                            if (not os.path.isfile(completePath)):
                                                                try:
                                                                    resp = requests.get(apiJir3dFiles+"scripts/"+file)
                                                                except:
                                                                    print("No existe gcodeCript in Server")
                                                                else:
                                                                    localFile = open(completePath, "w")
                                                                    localFile.write(resp.text)
                                                                    localFile.close()
                                                        url = apiJir3dRepositorio+responsePutJson['lastPrint']+"/"+printerName
                                                        resp = requests.get(url)
                                                        completeName = Impresora().updatesDir+"impresion.gcode"
                                                        file1 = open(completeName, "w")
                                                        file1.write(resp.text)
                                                        file1.close()
                                                        impresoraLocalOcto.turnPsuOn()
                                                        time.sleep(sleepTimeBeforePrint)
                                                        impresoraLocalOcto.imprimir()
                                                elif (comando == "on"):
                                                    print("PRENDIENDO")
                                                    # impresoraLocal.sendGcodeCommand("M80")
                                                    impresoraLocalOcto.turnPsuOn()
                                                elif (comando == "off"):
                                                    print("APAGANDO")
                                                    # impresoraLocal.sendGcodeCommand("M81")
                                                    impresoraLocalOcto.turnPsuOff()
                                                elif (comando == "pausar"):
                                                    impresoraLocalOcto.jobPrinter("pause")
                                                elif (comando == "parar"):
                                                    impresoraLocalOcto.jobPrinter("cancel")
                                                    # impresoraLocalOcto.turnPsuOff()
                                                elif (comando == "reiniciar"):
                                                    impresoraLocalOcto.jobPrinter("restart")
                                                elif (comando == "continuar"):
                                                    impresoraLocalOcto.jobPrinter("resume")
                                                elif (comando == "up"):
                                                    print("ARRIBA")
                                                    impresoraLocalOcto.turnPsuOn()
                                                    impresoraLocalOcto.sendGcodeCommandUp()
                                                elif (comando == "down"):
                                                    print("ARRIBA")
                                                    impresoraLocalOcto.turnPsuOn()
                                                    impresoraLocalOcto.sendGcodeCommandDown()
                                                
                                else:
                                    print("Impresora no está activa")
            elif (printerName == 'nombre_jir3d'):
                print('(JIR3D) Impresora no configurada en octoprint')    
                
            print('\n')
            
            et = time.time()
            elapsed_time = et - st
            
            if (elapsed_time<sleepTime):
                time.sleep(sleepTime-elapsed_time)
                
            # et2 = time.time()
            # elapsed_time2 = et2 - st
            
            # print(elapsed_time2)
            
            # if (printerName != 'nombre_jir3d'):
            #     try:
            #         localPrinter = requests.request(
            #             "GET", localPrinterUrlOcto, headers=headers)
            #     except:
            #         print("Error with __" + localPrinterUrlOcto+"__ get request")
            #     else:
            #         try:
            #             rawRespPrinterApiJir3d = requests.get(printerApiJir3d)
            #         except:
            #             print("Error with __" +
            #                   printerApiJir3d + "__ get request")
            #         else:
            #             try:
            #                 jsonRespPrinterApiJir3d = json.loads(
            #                     rawRespPrinterApiJir3d.text)
            #             except:
            #                 print(
            #                     "Error with converting to json __" + printerApiJir3d)
            #                 print(
            #                     "Msj __" + rawRespPrinterApiJir3d.text)
            #             else:
            #                 try:
            #                     jsonRespPrinterApiJir3d['isActive']
            #                 except:
            #                     print(
            #                         "impresora-isActive No definida, activandola en False")
            #                     requests.put(
            #                         printerApiJir3d, headers={
            #                             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
            #                         },
            #                         data=json.dumps({"isActive": True})
            #                     )
            #                 else:
            #                     isActive = jsonRespPrinterApiJir3d['isActive']
            #                     if (isActive):
            #                         data = {}
            #                         data['_octoprint_API'] = {
            #                             "uReporte": int(round(time.time())),
            #                             "connection": impresoraLocalOcto.status(),
            #                             "printerState": impresoraLocalOcto.printerStatus(),
            #                             "printProgress": json.loads(impresoraLocalOcto.getPrintProgress().text),
            #                         }
            #                         try:
            #                             responsePut = requests.put(
            #                                 printerApiJir3d,
            #                                 headers={
            #                                     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
            #                                 },
            #                                 data=json.dumps(data)
            #                             )
            #                         except:
            #                             print(
            #                                 "Error en put request"+printerApiJir3d)
            #                         else:
            #                             try:
            #                                 responsePutJson = json.loads(
            #                                     responsePut.text.replace("\\r", ""))
            #                             except:
            #                                 print(
            #                                     "Error convirtiendo put response a Json")
            #                             else:
            #                                 try:
            #                                     responsePutJson['comando']
            #                                 except:
            #                                     print(
            #                                         "No existe comando en put response")
            #                                 else:
            #                                     comando = responsePutJson['comando']
            #                                     if (comando == "nivelar" or comando == "imprimir"):
            #                                         try:
            #                                             responsePutJson['gcodeFile']
            #                                         except:
            #                                             print(
            #                                                 "No existe gcodeFile en put response")
            #                                         else:
            #                                             if (not os.path.isfile(Impresora().scriptsDir+"afterPrintCancelled")):
            #                                                 try:
            #                                                     resp = requests.get(jir3dAPI+"/scripts.php?file="+"afterPrintCancelled")
            #                                                 except:
            #                                                     print("No existe gcodeCript in Server")
            #                                                 else:
            #                                                     localFile = open(Impresora().scriptsDir+"afterPrintCancelled", "w")
            #                                                     localFile.write(resp.text)
            #                                                     localFile.close()
            #                                             if (comando == "nivelar"):
            #                                                 try:
            #                                                     responsePutJson['gcodeFile']
            #                                                 except:
            #                                                     print(
            #                                                         "no se recibió nivelar gcode file")
            #                                                 else:
            #                                                     try:
            #                                                         completeName = Impresora().updatesDir+"nivelar.gcode"
            #                                                         # completeName = os.path.join(
            #                                                         #     Impresora().updatesDir, "nivelar.gcode")
            #                                                         file1 = open(
            #                                                             completeName, "w")
            #                                                     except:
            #                                                         print(
            #                                                             "La ruta para guardar archivo __ "+Impresora().updatesDir+" __no es valida")
            #                                                     else:
            #                                                         for file in files:
            #                                                             completePath = Impresora().scriptsDir+file
            #                                                             if (os.path.isfile(completePath)):
            #                                                                 os.remove(
            #                                                                     completePath)
            #                                                         file1.write(
            #                                                             responsePutJson['gcodeFile'])
            #                                                         file1.close()
            #                                                         impresoraLocalOcto.turnPsuOn()
            #                                                         time.sleep(
            #                                                             sleepTimeBeforePrint)
            #                                                         impresoraLocalOcto.nivelar()
            #                                             elif (comando == "imprimir"):
            #                                                 for file in files:
            #                                                     completePath = Impresora().scriptsDir+file
            #                                                     if (not os.path.isfile(completePath)):
            #                                                         try:
            #                                                             nameF = jir3dAPI+"/scripts.php?file="+file
            #                                                             resp = requests.get(
            #                                                                 nameF)
            #                                                         except:
            #                                                             print(
            #                                                                 "No existe gcodeCript in Server")
            #                                                         else:
            #                                                             localFile = open(
            #                                                                 completePath, "w")
            #                                                             localFile.write(
            #                                                                 resp.text)
            #                                                             localFile.close()
            #                                                 completeName = Impresora().updatesDir+"impresion.gcode"
            #                                                 # completeName = os.path.join(
            #                                                 #     Impresora().updatesDir, "impresion.gcode")
            #                                                 file1 = open(
            #                                                     completeName, "w")
            #                                                 file1.write(
            #                                                     responsePutJson['gcodeFile'])
            #                                                 file1.close()
            #                                                 # print(
            #                                                 #     "(JIR3D) Primeras 20 lineas de impresión")
            #                                                 # print(
            #                                                 #     "\n_______INICIOS DE GCODE (20)_________")
            #                                                 # with open(completeName) as myfile:
            #                                                 #     for x in range(20):
            #                                                 #         # si = next(myfile)
            #                                                 #         print(
            #                                                 #             next(myfile).strip('\n'))
            #                                                 # print(
            #                                                 #     "_______FIN DE GCODE (20)_________")
            #                                                 impresoraLocalOcto.turnPsuOn()
            #                                                 time.sleep(
            #                                                     sleepTimeBeforePrint)
            #                                                 impresoraLocalOcto.imprimir()
            #                                     elif (comando == "on"):
            #                                         print("PRENDIENDO")
            #                                         # impresoraLocal.sendGcodeCommand("M80")
            #                                         impresoraLocalOcto.turnPsuOn()
            #                                     elif (comando == "off"):
            #                                         print("APAGANDO")
            #                                         # impresoraLocal.sendGcodeCommand("M81")
            #                                         impresoraLocalOcto.turnPsuOff()
            #                                     elif (comando == "pausar"):
            #                                         impresoraLocalOcto.jobPrinter(
            #                                             "pause")
            #                                     elif (comando == "parar"):
            #                                         impresoraLocalOcto.jobPrinter(
            #                                             "cancel")
            #                                         # impresoraLocalOcto.turnPsuOff()
            #                                     elif (comando == "reiniciar"):
            #                                         impresoraLocalOcto.jobPrinter(
            #                                             "restart")
            #                                     elif (comando == "continuar"):
            #                                         impresoraLocalOcto.jobPrinter(
            #                                             "resume")
            #                                     elif (comando == "up"):
            #                                         print("ARRIBA")
            #                                         impresoraLocalOcto.turnPsuOn()
            #                                         impresoraLocalOcto.sendGcodeCommandUp()
            #                                     elif (comando == "down"):
            #                                         print("ARRIBA")
            #                                         impresoraLocalOcto.turnPsuOn()
            #                                         impresoraLocalOcto.sendGcodeCommandDown()
            #                                     print("comando: "+comando)
            #                     else:
            #                         print("Impresora no está activa")
            # elif (printerName == 'nombre_jir3d'):
            #     print('(JIR3D) Impresora no configurada en octoprint')
            # print('\n')
            # time.sleep(sleepTime)

    def paralelo(self):
        self._logger.info("Starting Jir3d Plugin")
        
    # def on_settings_save(self):
	# 	octoprint.plugin.SettingsPlugin.on_settings_save(self)
	# 	def registerApp(self):
	# 		self._logger.info("Saving settings")
    #     import threading
	# 	thread = threading.Thread(target=registerApp)
	# 	thread.daemon = False
	# 	thread.start()
        

class Impresora:
    urlConnection = "http://localhost:5000/api/connection"
    urlPSU = "http://localhost:5000/api/plugin/psucontrol"
    urlImprimir = "http://localhost:5000/api/files/local/nivelar.gcode"
    urlImprimir2 = "http://localhost:5000/api/files/local/impresion.gcode"
    urlJob = "http://localhost:5000/api/job"
    urlPrinter = "http://localhost:5000/api/printer"
    urlCommand = "http://localhost:5000/api/printer/command"
    urlprinthead = "http://localhost:5000/api/printer/printhead"

    if (platform.system() == "Windows"):
        updatesDir = (os.getenv('APPDATA')+"/Octoprint/uploads/")
        scriptsDir = (os.getenv('APPDATA')+"/Octoprint/scripts/gcode/")
    elif (os.getenv("HOME") == "/home/pi"):
        # elif (os.getenv("HOME") == "/root"):
        updatesDir = "/home/pi/.octoprint/uploads/"
        scriptsDir = "/home/pi/.octoprint/scripts/gcode/"
        # os.path.join(Impresora().updatesDir, "nivelar.gcode")
    else:
        updatesDir = "/octoprint/octoprint/uploads/"
        scriptsDir = "/octoprint/octoprint/scripts/gcode/"

    def __init__(self, nombre="jir3d_nombre", apikey="jir3d_apikey"):
        self.nombre = nombre
        self.apikey = apikey

    def status(self):
        return requests.request(
            "GET",
            self.urlConnection,
            headers={'Authorization': 'Bearer ' + self.apikey}
        ).json()

    def printerStatusFlags(self):
        return requests.request(
            "GET",
            self.urlPrinter,
            headers={'Authorization': 'Bearer ' + self.apikey}
        ).json().get('state', {}).get('flags', {})

    def printerStatus(self):
        return requests.request(
            "GET",
            self.urlPrinter,
            headers={'Authorization': 'Bearer ' + self.apikey}
        ).json()

    def printerStatusTemperatureBed(self):
        return requests.request(
            "GET",
            self.urlPrinter,
            headers={'Authorization': 'Bearer ' + self.apikey}
        ).json().get('temperature', {}).get('bed', {}).get('actual', {})

    def printerStatusTemperatures(self):
        return requests.request(
            "GET",
            self.urlPrinter,
            headers={'Authorization': 'Bearer ' + self.apikey}
        ).json().get('temperature', {})

    def printerStatusTemperatureNozzle(self):
        return requests.request(
            "GET",
            self.urlPrinter,
            headers={'Authorization': 'Bearer ' + self.apikey}
        ).json().get('temperature', {}).get('tool0', {}).get('actual', {})

    def turnPsuOn(self):
        return requests.request(
            "POST",
            self.urlPSU,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            },
            data=json.dumps({"command": "turnPSUOn"})
        )

    def printHeadMove(self):
        return requests.request(
            "POST",
            self.urlprinthead,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "command": "jog",
                "x": 10,
                "y": -5,
                "z": 0.02
            })
        )

    def sendGcodeCommand(self, command):
        return requests.request(
            "POST",
            self.urlCommand,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            },
            data=json.dumps({"command": command})
        )

    def sendGcodeCommandUp(self):
        return requests.request(
            "POST",
            self.urlCommand,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            },
            data=json.dumps({"commands": [
                "M80",
                "G0 Z10 F200"
            ]})
        )

    def sendGcodeCommandDown(self):
        return requests.request(
            "POST",
            self.urlCommand,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            },
            data=json.dumps({"commands": [
                "M80",
                "G0 Z-10 F200"
            ]})
        )

    def turnPsuOff(self):
        return requests.request(
            "POST",
            self.urlPSU,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            },
            data=json.dumps({"command": "turnPSUOff"})
        )

    def nivelar(self):
        return requests.request(
            "POST",
            self.urlImprimir,
            headers={'Authorization': 'Bearer ' + self.apikey,'Content-Type': 'application/json'},
            data=json.dumps({"command": "select", "print": "true"})
        )

    def getPrintProgress(self):
        return requests.request(
            "GET",
            self.urlJob,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            })

    def imprimir(self):
        return requests.request(
            "POST",
            self.urlImprimir2,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            },
            data=json.dumps({"command": "select", "print": "true"})
        )

    def jobPrinter(self, option):
        if (option == "pause"):
            data = {
                "command": "pause",
                "action": "pause"
            }
        elif (option == "resume"):
            data = {
                "command": "pause",
                "action": "resume"
            }
        else:
            data = {"command": option}
        return requests.request(
            "POST",
            self.urlJob,
            headers={
                'Authorization': 'Bearer ' + self.apikey,
                'Content-Type': 'application/json'
            },
            data=json.dumps(data)
        )


# Set the Python version your plugin is compatible with below. Recommended is Python 3 only for all new plugins.
# OctoPrint 1.4.0 - 1.7.x run under both Python 3 and the end-of-life Python 2.
# OctoPrint 1.8.0 onwards only supports Python 3.
__plugin_pythoncompat__ = ">=3,<4"  # Only Python 3
__plugin_name__ = "Jir3d Plugin"


def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = Jir3dPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }

def __plugin_unload__():
    __plugin_implementation__._logger("SE __plugin_unload__")

def __plugin_disable__():
    __plugin_implementation__._logger("SE __plugin_disable__")


def on_plugin_disabled():
    __plugin_implementation__._logger("SE on_plugin_disabled")
