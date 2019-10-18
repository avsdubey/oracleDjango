@FORFILES  /m *.less /C "cmd /c lessc --clean-css @fname.less @fname.css"
@move *.css ..\styles\
@echo Done