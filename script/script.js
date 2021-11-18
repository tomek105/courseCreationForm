const paymentSwitch = document.getElementById('paymentSwitch');
const addParticipant = document.getElementById('addParticipant');
const companyInfo = document.getElementById('companyInfo');
const companyNIP = document.getElementById('companyNIP');
  

const participantList = document.getElementById('participantList');
const participantForm = document.getElementById('participantForm');
const participantSwitch = document.getElementById('participantSwitch');
const rodoCheckbox = document.getElementById('rodoCheckbox');
const sendRequest = document.getElementById('submit');


let participantTable=[];  //tablica przechowująca obiekty kursant

//Inputy, z ktorych pobierane sa wartosci dla obiektu
const participantFullname = document.getElementById('participantFullnameInput');
const participantJob = document.getElementById('participantJobInput');
const participantAge = document.getElementById('participantAgeInput');

document.addEventListener("DOMContentLoaded", () => {
    
    addParticipant.addEventListener('click', (event)=>{
        if(!participantFullname.value.startsWith(" ") && participantFullname.value.length > 2 && 
        !participantJob.value.startsWith(" ") && participantJob.value.length > 2 &&
        !participantAge.value.startsWith(" "))
        {   
            const newParticipant = 
            {
                name: participantFullname.value,
                job: participantJob.value,
                age: participantAge.value
            }

            //walidacja, sprawdza dla obiektow  czy powtarzają się opisy i nazwy. Jeżeli choć jedna rzecz się różni przechodzi dalej       
            for (let participant of participantTable) {
                if (participant.name === participantFullname.value && participant.job === participantJob.value && participant.age === participantAge.value ) {
                    alert('Nie można dodać tej samej osoby 2 raz!')
                    return;
                }
            }

            participantTable.push(newParticipant); //dodawanie do tablicy participantTable obiektów participant

            participantFullname.value= "", 
            participantJob.value = "", 
            participantAge.value = "" 

            renderList();
            console.log(participantTable)
        }else{
            alert("Wypełnij wymagane pola kursanta!")
        }
    });
})

const renderList = () => {
    participantList.innerHTML = "";

    participantTable.forEach((participant, index) => {
        let participantLi = document.createElement('li');
        let removeParticipant = document.createElement("button");
        removeParticipant.addEventListener("click", handleRemove)

        participantLi.textContent  = `  ${participant.name}, ${ participant.job}, ${participant.age} lat/a`;
        participantLi.classList.add('list-group-item','list-group-item-dark', 'd-flex', 'align-items-center');
        removeParticipant.dataset.itemId = index;
        removeParticipant.innerText = "Usuń";
        removeParticipant.classList.add('btn', 'btn-danger', 'ms-auto');       
        
        participantLi.appendChild(removeParticipant);
        participantList.appendChild(participantLi);
    })
}

const handleRemove = ()=>{  
        let participantToRemove = participantTable[Math.round(event.target.dataset.itemId)]; 
        participantTable = participantTable.filter((participant) => {
        if (participant !== participantToRemove) {
            return true;
        }
    })
    renderList();
}

const handleCompanyInfoSwitch = () =>{
    if(paymentSwitch.checked){
        companyInfo.classList.add('show');
    }
    else{
        companyInfo.classList.remove('show');
    }
}

const handleParticipantSwitch = () =>{
    if(participantSwitch.checked){
        participantForm.classList.add('show');
    }
    else{
        participantForm.classList.remove('show');
    }
}

const handleRodoCheckboxSwitch = () =>{
    if(rodoCheckbox.checked ){
        sendRequest.classList.remove('disabled');  
        if(paymentSwitch.checked){
            if(companyNIP.value.startsWith(" ") || companyNIP.value.length !== 10){
                sendRequest.classList.add('disabled');  
                alert("NIP firmy do faktury musi mieć 10 znaków!")
                rodoCheckbox.checked = false;
            }
        }
    }  
    else{
        sendRequest.classList.add('disabled');  
    }      
}


$(document).ready(function(){
     // submit button click
     $("#submit").click(function(){

        const courseName = $("#courseName").val();
        const courseDate = $("#courseDate").val();
        const applicantName = $("#applicantName").val();
        const applicantAddress = $("#applicantAddress").val();
        const applicantEmail = $("#applicantEmail").val();
        const applicantJob = $("#applicantJob").val();
        const levelOfDifficulty = $("#selectLevel").val();
        const companyName = $("#companyName").val();
        const companyAddress = $("#companyAddress").val();
        const companyNIP = $("#companyNIP").val();
        const myJsonString = JSON.stringify(participantTable);
        console.log(myJsonString);

            $.ajax({
                url: 'action.php',
                type: 'post',
                data: {
                    data:myJsonString,
                    courseName:courseName,
                    courseDate:courseDate,
                    applicantName:applicantName,
                    applicantAddress:applicantAddress,
                    applicantEmail:applicantEmail,
                    applicantJob:applicantJob,
                    levelOfDifficulty:levelOfDifficulty,
                    companyName:companyName,
                    companyAddress:companyAddress,
                    companyNIP:companyNIP},
                dataType: 'JSON',
                success: function(result) {
                    console.log('wyslano dane! ', result);
                    alert('Wysłano');

                },
                error: function(log) {
                   console.log(log);
                   $("#textAjax").text("Wysłano dane")
                }
            })
    });
});

participantSwitch.addEventListener('click', handleParticipantSwitch);
paymentSwitch.addEventListener('click', handleCompanyInfoSwitch);
rodoCheckbox.addEventListener('click', handleRodoCheckboxSwitch);
