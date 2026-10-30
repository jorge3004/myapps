import octoprint.plugin


class MyApps3DPlugin(octoprint.plugin.StartupPlugin, octoprint.plugin.SettingsPlugin):
    def get_settings_defaults(self):
        return {"backend_url": "http://localhost:4100", "api_key": ""}

    def on_after_startup(self):
        self._logger.info("MyApps3D: hello world (backend=%s)", self._settings.get(["backend_url"]))


__plugin_name__ = "MyApps3D"
__plugin_pythoncompat__ = ">=3.7,<4"
__plugin_implementation__ = MyApps3DPlugin()
