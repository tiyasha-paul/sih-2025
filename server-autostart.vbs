' =============================================
' HydroLens Auto-Start Server (Background Service)
' This script checks if server is running and starts it if needed
' Runs completely silently in the background
' =============================================

Set WshShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objHTTP = CreateObject("MSXML2.XMLHTTP")

' Get the directory where this script is located
scriptDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
chatDir = scriptDir & "\CHAT"

' Function to check if server is running
Function IsServerRunning()
    On Error Resume Next
    objHTTP.Open "GET", "http://127.0.0.1:5000/", False
    objHTTP.setRequestHeader "User-Agent", "HydroLens-AutoStart"
    objHTTP.Send

    If Err.Number = 0 And objHTTP.Status = 200 Then
        IsServerRunning = True
    Else
        IsServerRunning = False
    End If
    On Error GoTo 0
End Function

' Check if server is already running
If Not IsServerRunning() Then
    ' Server not running, start it
    WshShell.Run "cmd /c cd /d """ & chatDir & """ && python main.py --serve", 0, False

    ' Wait a moment to ensure server starts
    WScript.Sleep 2000
End If

' Server is running or has been started
' Exit silently
WScript.Quit
