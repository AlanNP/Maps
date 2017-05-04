// Wait for Cordova to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);

        var currentRow;
        // Populate the database
        //
        function populateDB(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS PARADA (id INTEGER PRIMARY KEY AUTOINCREMENT, ID_PARADA INTEGER,PIN_PARADA TEXT, REFERENCIA_PARADA TEXT, DESCRIPCION_PARADA TEXT,TIPO_PARADA TEXT,HORARIO_ENTREGA TEXT)');
        }

        // Query the database
        //
        function queryDB(tx) {
            tx.executeSql('SELECT * FROM PARADA', [], querySuccess, errorCB);
        }

        function searchQueryDB(tx) {
            tx.executeSql("SELECT * FROM DEMO where name like ('%"+ document.getElementById("txtName").value + "%')",
                    [], querySuccess, errorCB);
        }
        // Query the success callback
        //
        function querySuccess(tx, results) {
            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var tmpArgs=results.rows.item(i).ID_PARADA + ",'" + results.rows.item(i).REFERENCIA_PARADA;
                        alert(tmpArgs);
            }
            
        }

        //Delete query
        function deleteRow(tx) {
          tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
        }

        // Transaction error callback
        //
        function errorCB(err) {
            alert("Error processing SQL: "+err.code);
        }

        // Transaction success callback
        //
        function successCB() {
            var db = window.openDatabase("RUTA", "1.0", "DATABASE", 200000);
            db.transaction(queryDB, errorCB);
        }

         // Cordova is ready
        //
        function onDeviceReady() {
            var db = window.openDatabase("RUTA", "1.0", "DATABASE", 200000);
            db.transaction(populateDB, errorCB, successCB);
        }

        //Insert query
        //
        function insertDB(tx) {
            tx.executeSql('INSERT INTO PARADA (ID_PARADA,REFERENCIA_PARADA) VALUES (111,"OLI")');
        }

        function goInsert() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(insertDB, errorCB, successCB);
        }

        function goSearch() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(searchQueryDB, errorCB);
        }

        function goDelete() {
             var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
             db.transaction(deleteRow, errorCB);
             document.getElementById('qrpopup').style.display='none';
        }

        //Show the popup after tapping a row in table
        //
        function goPopup(row,rowname,rownum) {
            currentRow=row;
            document.getElementById("qrpopup").style.display="block";
            document.getElementById("editNameBox").value = rowname;
            document.getElementById("editNumberBox").value = rownum;
        }

        function editRow(tx) {
            tx.executeSql('UPDATE DEMO SET name ="'+document.getElementById("editNameBox").value+
                    '", number= "'+document.getElementById("editNumberBox").value+ '" WHERE id = '
                    + currentRow, [], queryDB, errorCB);
        }
        function goEdit() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(editRow, errorCB);
            document.getElementById('qrpopup').style.display='none';
        }

       