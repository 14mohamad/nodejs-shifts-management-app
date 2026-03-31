
function get() {
    // XMLHttpRequest - 
    let req = new XMLHttpRequest();

    // XMLHttpRequest.open(method: string, url: string)
    req.open('GET', 'http://localhost:3000/all');

    req.onreadystatechange = () => {
        // readyState of 4 - DONE (operation is complete).
        if (req.readyState === 4) {
            // req.response - is the data that returns from the address
            // JSON.parse() - convert to array. 
            let arr = JSON.parse(req.response);

            let result = '';
            result += `<th>ID</th><th>ראשון</th><th>שני</th><th>שלישי</th>
            <th>רביעי</th><th>חמישי</th><th>הסר משמרת</th>`
            for (const shift of arr) {
                // tr -> table row, td -> table data(cell)
                result += `
                <tr>
                    <td>${shift.id}</td>
                    <td>${shift.sunday}<br>
                    <button onclick="put('${shift.id}','sunday')" class="btn btn-secondary btn-sm" >ערוך</button>
                    </td>
                    <td>${shift.monday}<br>
                    <button onclick="put('${shift.id}','monday')" class="btn btn-secondary btn-sm" >ערוך</button>
                    </td>
                    <td>${shift.tuesday}<br>
                    <button onclick="put('${shift.id}','tuesday')" class="btn btn-secondary btn-sm" >ערוך</button>
                    </td>
                    <td>${shift.wednesday}<br>
                    <button onclick="put('${shift.id}','wednesday')" class="btn btn-secondary btn-sm" >ערוך</button>
                    </td>
                    <td>${shift.thursday}<br>
                    <button onclick="put('${shift.id}','thursday')" class="btn btn-secondary btn-sm">ערוך</button>
                    </td>
                    <td><button onclick="deleteShift('${shift.id}')" class="btn btn-danger" style="margin-top:5%" >הסרה</button></td>
                </tr>
                `
            }
            document.getElementById('shiftsTable').innerHTML = result;
        }
    }
    req.send();
}

function post() {

    let sunday = document.getElementById('sunday').value;
    let monday = document.getElementById('monday').value;
    let tuesday = document.getElementById('tuesday').value;
    let wednesday = document.getElementById('wednesday').value;
    let thursday = document.getElementById('thursday').value;

    fetch(`http://localhost:3000/add/`, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sunday: sunday,
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday
        })
    }).then(res => res.json())
        .then(res => {
            if (res.ack == 1) {
                get()
            } else {
                alert("לא ניתן להוסיף משמרת זו")
            }
        })
}

function put (id, key){
    let newValue = prompt(`הכנס עובד אחר למשמרת זו`);
    if(newValue == null){return}
    
    let sendReq = {}
    sendReq[key] = newValue

    fetch(`http://localhost:3000/update/${id}`,{
      method: 'put',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendReq)
    }).then(res => res.json())
    .then(res =>{
      if(res.ack == 1){
        get()
      }else if (res.ack == -1){
        alert("לא ניתן לעדכן משמרת זו")
      }
    })
}

function deleteShift(id) {
    let req = new XMLHttpRequest();
    req.open('DELETE', `http://localhost:3000/delete/${id}`);
    req.onreadystatechange = () => {
        if (req.readyState === 4) get();
    }
    req.send();
}

function clearTable() {
    let req = new XMLHttpRequest();
    req.open('DELETE', `http://localhost:3000/deleteAll`);
    req.onreadystatechange = () => {
        if (req.readyState === 4) get();
    }
    req.send();
}

