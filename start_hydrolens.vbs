' =============================================
' HydroLens Silent Auto-Launcher (No Console Window)
' Double-click this file to start HydroLens without any command prompt windows
' =============================================

Set WshShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
scriptDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
chatDir = scriptDir & "\CHAT"

' Start the Flask server hidden (no window)
WshShell.Run "cmd /c cd /d """ & chatDir & """ && python main.py --serve", 0, False

' Wait 8 seconds for server to start
WScript.Sleep 8000

' Open the browser
WshShell.Run "http://127.0.0.1:5000", 1, False

' Show success message
MsgBox "HydroLens is now running!" & vbCrLf & vbCrLf & _
       "Browser should open automatically." & vbCrLf & vbCrLf & _
       "If not, go to: http://127.0.0.1:5000" & vbCrLf & vbCrLf & _
       "Note: The server is running in the background." & vbCrLf & _
       "To stop it, use Task Manager to end 'python.exe'", _
       vbInformation, "HydroLens Started"
