 <?php
 use PHPMailer\PHPMailer\PHPMailer;
 use PHPMailer\PHPMailer\Exception;
 require("PHPMailer-master/src/Exception.php");
 require("PHPMailer-master/src/PHPMailer.php");
 require("PHPMailer-master/src/SMTP.php");



	if (isset($_POST['courseName']) && isset($_POST['courseDate']) &&
        isset($_POST['applicantName'])&& isset($_POST['applicantEmail']) && isset($_POST['applicantAddress']) &&
        isset($_POST['applicantJob']) && isset($_POST['levelOfDifficulty'])) {
        //dane kursu
		$courseName = $_POST['courseName'];
		$courseDate = $_POST['courseDate'];
		$levelOfDifficulty = $_POST['levelOfDifficulty'];

		//dane zglaszajacego 
		$applicantName = $_POST['applicantName'];
		$applicantAddress = $_POST['applicantAddress'];
		$applicantJob = $_POST['applicantJob'];

		//dane firmy do faktury
		$companyName = $_POST['companyName'];
		$companyAddress = $_POST['companyAddress'];
		$companyNIP = $_POST['companyNIP'];

		//dane kursanta
		$data = $_POST['data'];
		$participantArray = json_decode($data, true); //tablica kursantow
	
				
		//Połączenie BD
        $host = "localhost";
        $dbUsername = "root";
        $dbPassword = "";
        $dbName = "kursbd";
        $conn = mysqli_connect($host, $dbUsername, $dbPassword, $dbName);
		if($conn->connect_error) {
            die('Could not connect to the database.');
        }
        else {
		//Operacje na BD
			$query2 = "INSERT INTO kurs(Nazwa, Data_rozpoczecia, Poziom_trudnosci) VALUES('$courseName', '$courseDate', '$levelOfDifficulty')";
			$run = mysqli_query($conn, $query2) or die(mysqli_error($conn));

			$latest_id =  mysqli_insert_id($conn);    //ostatnie id
			
			$query = "INSERT INTO zgloszenie(ID_kursu ,Imie_nazwisko, Adres, Stanowisko, Nazwa_firmy, Adres_firmy, NIP) VALUES($latest_id, '$applicantName', '$applicantAddress', '$applicantJob', '$companyName', '$companyAddress', '$companyNIP')";
			$run2 = mysqli_query($conn, $query) or die(mysqli_error($conn));
			
			foreach($participantArray as $participant){
				$participantName = $participant['name'];
				$participantAge = $participant['age'];
				$participantJob = $participant['job'];
				echo $participantName.' '.$participantAge.' '.$participantJob.'<br/>';

				$run3 = mysqli_query($conn, "INSERT INTO kursant(ID_zgloszenia, Imie_nazwisko, Wiek, Stanowisko) VALUES($latest_id, '$participantName', '$participantAge', '$participantJob')")  or die(mysqli_error($conn));
		  }

			if($run &&$run2 && $run3){
				echo "Dodano nowe rekordy do bazy danych! \n";
			}
			else{
				echo "Wystąpił problem!";
			}
			mysqli_close($conn);
        }

		//Wysylka maila
		$mail = new PHPMailer;
		$emailaddress = $_POST['applicantEmail'];
		$fullname = $_POST['applicantName'];

		$mail->From = $emailaddress;
		$mail->FromName = $fullname;

		$mail->addAddress("lisssu14@gmail.com", "Tomasz z BDG");


		$mail->isHTML(true);

		$mail->Subject = "Mail ze strony Interaktywny formularz";
		$mail->Body = "<h1>Twoje zgłoszenie ma nr. $latest_id</h1>
		<p>W Kurs: $courseName, dnia: $courseDate, poziom trudności: $levelOfDifficulty</p>";
		if($mail->send()){
		 	echo 'Message has been sent';
		}
		else{
		 	echo 'Message could not be sent.';
		 	echo 'Mailer Error: ' . $mail->ErrorInfo;
		}
    }
    else {
        echo "All field are required.";
        die();
    }
?> 
