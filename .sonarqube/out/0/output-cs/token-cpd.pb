¨	
rD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Repositories\IPredictionRepository.cs
public 
	interface !
IPredictionRepository &
{ 
Task		 
<		 	
List			 
<		 

Prediction		 
>		 
>		 "
GetAllByPatientIdAsync		 1
(		1 2
Guid		2 6
	patientId		7 @
)		@ A
;		A B
Task

 
<

 	

Prediction

	 
>

 
GetByIdAsync

 !
(

! "
Guid

" &
predictionId

' 3
)

3 4
;

4 5
Task 
< 	
bool	 
> 
AddAsync 
( 

Prediction "

prediction# -
)- .
;. /
Task 
< 	
bool	 
> 
UpdateAsync 
( 

Prediction %

prediction& 0
)0 1
;1 2
Task 
< 	
bool	 
> 
DeleteAsync 
( 
Guid 
predictionId  ,
), -
;- .
} °
oD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Repositories\IPatientRepository.cs
public 
	interface 
IPatientRepository #
{ 
Task 
< 	
List	 
< 
Patient 
> 
> 
GetAllPatientsAsync +
(+ ,
), -
;- .
Task 
< 	
Patient	 
> 
GetPatientByIdAsync %
(% &
Guid& *
	patientId+ 4
)4 5
;5 6
Task 
< 	
bool	 
> 
UpdateAsync 
( 
Patient "
patient# *
)* +
;+ ,
Task		 
<		 	
Guid			 
>		 
DeletePatientAsync		 !
(		! "
Guid		" &
	patientId		' 0
)		0 1
;		1 2
Task

 
<

 	
Guid

	 
>

 
AddPatientAsync

 
(

 
Patient

 &
product

' .
)

. /
;

/ 0
void 
Detach	 
( 
Patient 
existingPatient '
)' (
;( )
Task 
< 	
bool	 
> 
PatientExistsAsync !
(! "
Guid" &
	patientId' 0
)0 1
;1 2
} µ
uD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Repositories\IMedicalRecordRepository.cs
public 
	interface $
IMedicalRecordRepository )
{ 
Task		 
<		 	
List			 
<		 
MedicalRecord		 
>		 
>		 "
GetMedicalRecordsAsync		 4
(		4 5
)		5 6
;		6 7
Task

 
<

 	
List

	 
<

 
MedicalRecord

 
>

 
>

 "
GetAllByPatientIdAsync

 4
(

4 5
Guid

5 9
	patientId

: C
)

C D
;

D E
Task 
< 	
MedicalRecord	 
> %
GetMedicalRecordByIdAsync 1
(1 2
Guid2 6
recordId7 ?
)? @
;@ A
Task 
< 	
Guid	 
> !
AddMedicalRecordAsync $
($ %
MedicalRecord% 2
medicalRecord3 @
)@ A
;A B
Task 
< 	
bool	 
> 
UpdateAsync 
( 
MedicalRecord (
medicalRecord) 6
)6 7
;7 8
Task 
< 	
bool	 
> $
DeleteMedicalRecordAsync '
(' (
Guid( ,
recordId- 5
)5 6
;6 7
void 
Detach	 
( 
MedicalRecord 
existingRecord ,
), -
;- .
} µ
sD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Repositories\IAppointmentRepository.cs
	namespace 	
Infrastructure
 
. 
Repositories %
{ 
public 

	interface "
IAppointmentRepository +
{ 
Task 
< 
Appointment 
> #
GetAppointmentByIdAsync 1
(1 2
Guid2 6
appointmentId7 D
)D E
;E F
Task 
< 
List 
< 
Appointment 
> 
> #
GetAllAppointmentsAsync  7
(7 8
)8 9
;9 :
Task		 
<		 
Guid		 
>		 
AddAppointmentAsync		 &
(		& '
Appointment		' 2
appointment		3 >
)		> ?
;		? @
Task

 
<

 
bool

 
>

 "
UpdateAppointmentAsync

 )
(

) *
Appointment

* 5
appointment

6 A
)

A B
;

B C
Task 
< 
bool 
> "
DeleteAppointmentAsync )
() *
Guid* .
appointmentId/ <
)< =
;= >
void 
Detach 
( 
Appointment 
appointment  +
)+ ,
;, -
} 
} ü

eD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Entities\Prescription.cs
	namespace 	
Domain
 
. 
Entities 
{ 
public 

class 
Prescription 
{ 
public 
Guid 
PrescriptionId "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
MedicationName $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public		 
string		 
Dosage		 
{		 
get		 "
;		" #
set		$ '
;		' (
}		) *
public

 
string

 
	Frequency

 
{

  !
get

" %
;

% &
set

' *
;

* +
}

, -
public 
DateTime 
	StartDate !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
EndDate 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
Notes 
{ 
get !
;! "
set# &
;& '
}( )
} 
} Ú	
cD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Entities\Prediction.cs
	namespace 	
Domain
 
. 
Entities 
{ 
public 

class 

Prediction 
{ 
public 
Guid 
PredictionId  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public 
DateTime 
Date 
{ 
get "
;" #
set$ '
;' (
}) *
public 
float 
	RiskScore 
{  
get! $
;$ %
set& )
;) *
}+ ,
public		 
string		 
RiskFactors		 !
{		" #
get		$ '
;		' (
set		) ,
;		, -
}		. /
public

 
string

 
Recommendation

 $
{

% &
get

' *
;

* +
set

, /
;

/ 0
}

1 2
} 
} œ
`D:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Entities\Pacient.cs
	namespace 	
Domain
 
. 
Entities 
{ 
public 

enum 
Gender 
{ 
Male 
, 
Female 
, 
Other 
} 
public

 

class

 
Patient

 
{ 
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	FirstName 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
LastName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
DateTime 
DateOfBirth #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
Gender 
Gender 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
ContactInformation (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
Address 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	PhotoPath 
{  !
get" %
;% &
set' *
;* +
}, -
public 
List 
< 
MedicalRecord !
>! "
MedicalHistory# 1
{2 3
get4 7
;7 8
set9 <
;< =
}> ?
=@ A
newB E
ListF J
<J K
MedicalRecordK X
>X Y
(Y Z
)Z [
;[ \
public 
List 
< 
Appointment 
>  
Appointments! -
{. /
get0 3
;3 4
set5 8
;8 9
}: ;
=< =
new> A
ListB F
<F G
AppointmentG R
>R S
(S T
)T U
;U V
} 
} £
fD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Entities\MedicalRecord.cs
	namespace 	
Domain
 
. 
Entities 
{ 
public 

class 
MedicalRecord 
{ 
public 
Guid 
RecordId 
{ 
get "
;" #
set$ '
;' (
}) *
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public 
DateTime 
Date 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
	Diagnosis 
{  !
get" %
;% &
set' *
;* +
}, -
public		 
List		 
<		 
Prescription		  
>		  !
Prescriptions		" /
{		0 1
get		2 5
;		5 6
set		7 :
;		: ;
}		< =
=		> ?
new		@ C
List		D H
<		H I
Prescription		I U
>		U V
(		V W
)		W X
;		X Y
public

 
string

 
Notes

 
{

 
get

 !
;

! "
set

# &
;

& '
}

( )
} 
} «
dD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Domain\Entities\Appointment.cs
	namespace 	
Domain
 
. 
Entities 
{ 
public		 

enum		 
AppointmentStatus		 !
{

 
	Scheduled 
, 
	Completed 
, 
Canceled 
} 
public 

class 
Appointment 
{ 
public 
Guid 
AppointmentId !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public 
Guid 

ProviderId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
DateTime 
AppointmentDate '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
Reason 
{ 
get "
;" #
set$ '
;' (
}) *
public 
AppointmentStatus  
Status! '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} 