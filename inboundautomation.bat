@REM @echo off
@REM echo  On running the tests...
@REM call npx playwright test tests/inbound-automation.spec.ts
@REM echo Preparing the report...
@REM call npx playwright show-report
@REM pause

@echo off
npx playwright test tests/inbound-automation.spec.ts
powershell -command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Inbound automation completed successfully','Automation Finished')"