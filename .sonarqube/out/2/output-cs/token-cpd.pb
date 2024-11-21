≠
nD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Utils\ValidationBehaviour.cs
	namespace 	
Application
 
. 
Utils 
{ 
public 

class 
ValidationBehavior #
<# $
TRequest$ ,
,, -
	TResponse. 7
>7 8
:9 :
IPipelineBehavior; L
<L M
TRequestM U
,U V
	TResponseW `
>` a
whereb g
TRequesth p
:q r
IRequests {
<{ |
	TResponse	| Ö
>
Ö Ü
{ 
private 
readonly 
IEnumerable $
<$ %

IValidator% /
</ 0
TRequest0 8
>8 9
>9 :

validators; E
;E F
public

 
ValidationBehavior

 !
(

! "
IEnumerable

" -
<

- .

IValidator

. 8
<

8 9
TRequest

9 A
>

A B
>

B C

validators

D N
)

N O
{ 	
this 
. 

validators 
= 

validators (
;( )
} 	
public 
async 
Task 
< 
	TResponse #
># $
Handle% +
(+ ,
TRequest, 4
request5 <
,< ="
RequestHandlerDelegate> T
<T U
	TResponseU ^
>^ _
next` d
,d e
CancellationTokenf w
cancellationToken	x â
)
â ä
{ 	
var 
context 
= 
new 
ValidationContext /
</ 0
TRequest0 8
>8 9
(9 :
request: A
)A B
;B C
var 
failures 
= 

validators %
. 
Select 
( 
v 
=> 
v 
. 
Validate '
(' (
context( /
)/ 0
)0 1
. 

SelectMany 
( 
result "
=># %
result& ,
., -
Errors- 3
)3 4
. 
Where 
( 
f 
=> 
f 
!=  
null! %
)% &
. 
ToList 
( 
) 
; 
if 
( 
failures 
. 
Count 
!= !
$num" #
)# $
{ 
throw 
new 
ValidationException -
(- .
failures. 6
)6 7
;7 8
} 
return 
await 
next 
( 
) 
;  
} 	
} 
} π
iD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Utils\MappingProfile.cs
	namespace 	
Application
 
. 
Utils 
{ 
public 

class 
MappingProfile 
:  !
Profile" )
{		 
public

 
MappingProfile

 
(

 
)

 
{ 	
	CreateMap 
< 
Patient 
, 

PatientDTO )
>) *
(* +
)+ ,
., -

ReverseMap- 7
(7 8
)8 9
;9 :
	CreateMap 
<  
CreatePatientCommand *
,* +
Patient, 3
>3 4
(4 5
)5 6
.6 7

ReverseMap7 A
(A B
)B C
;C D
	CreateMap 
<  
UpdatePatientCommand *
,* +
Patient, 3
>3 4
(4 5
)5 6
.6 7

ReverseMap7 A
(A B
)B C
;C D
	CreateMap 
< 
MedicalRecord #
,# $
MedicalRecordDTO% 5
>5 6
(6 7
)7 8
.8 9

ReverseMap9 C
(C D
)D E
;E F
	CreateMap 
< &
CreateMedicalRecordCommand 0
,0 1
MedicalRecord2 ?
>? @
(@ A
)A B
.B C

ReverseMapC M
(M N
)N O
;O P
	CreateMap 
< &
UpdateMedicalRecordCommand 0
,0 1
MedicalRecord2 ?
>? @
(@ A
)A B
.B C

ReverseMapC M
(M N
)N O
;O P
	CreateMap 
< 
Appointment !
,! "
AppointmentDTO# 1
>1 2
(2 3
)3 4
.4 5

ReverseMap5 ?
(? @
)@ A
;A B
	CreateMap 
< $
CreateAppointmentCommand .
,. /
Appointment0 ;
>; <
(< =
)= >
.> ?

ReverseMap? I
(I J
)J K
;K L
	CreateMap 
< $
UpdateAppointmentCommand .
,. /
Appointment0 ;
>; <
(< =
)= >
.> ?

ReverseMap? I
(I J
)J K
;K L
} 	
} 
} á
ÑD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\QueryHandlers\GetPatientsQueryHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
QueryHandlers  -
{ 
public		 

class		 #
GetPatientsQueryHandler		 (
:		) *
IRequestHandler		+ :
<		: ;
GetPatientsQuery		; K
,		K L
List		M Q
<		Q R

PatientDTO		R \
>		\ ]
>		] ^
{

 
private 
readonly 
IPatientRepository +

repository, 6
;6 7
private 
readonly 
IMapper  
mapper! '
;' (
public #
GetPatientsQueryHandler &
(& '
IPatientRepository' 9

repository: D
,D E
IMapperF M
mapperN T
)T U
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
List 
< 

PatientDTO )
>) *
>* +
Handle, 2
(2 3
GetPatientsQuery3 C
requestD K
,K L
CancellationTokenM ^
cancellationToken_ p
)p q
{ 	
var 
patients 
= 
await  

repository! +
.+ ,
GetAllPatientsAsync, ?
(? @
)@ A
;A B
if 
( 
patients 
== 
null  
||! #
!$ %
patients% -
.- .
Any. 1
(1 2
)2 3
)3 4
{ 
return 
new 
List 
<  

PatientDTO  *
>* +
(+ ,
), -
;- .
} 
return 
mapper 
. 
Map 
< 
List "
<" #

PatientDTO# -
>- .
>. /
(/ 0
patients0 8
)8 9
;9 :
} 	
} 
}   ›
áD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\QueryHandlers\GetPatientByIdQueryHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
QueryHandlers  -
{ 
public		 

class		 &
GetPatientByIdQueryHandler		 +
:		, -
IRequestHandler		. =
<		= >
GetPatientByIdQuery		> Q
,		Q R

PatientDTO		S ]
>		] ^
{

 
public 
readonly 
IPatientRepository *

repository+ 5
;5 6
public 
readonly 
IMapper 
mapper  &
;& '
public &
GetPatientByIdQueryHandler )
() *
IPatientRepository* <

repository= G
,G H
IMapperI P
mapperQ W
)W X
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 

PatientDTO $
>$ %
Handle& ,
(, -
GetPatientByIdQuery- @
requestA H
,H I
CancellationTokenJ [
cancellationToken\ m
)m n
{ 	
var 
patient 
= 
await 

repository  *
.* +
GetPatientByIdAsync+ >
(> ?
request? F
.F G
IdG I
)I J
;J K
if 
( 
patient 
== 
null 
)  
{ 
return 
null 
; 
} 
return 
mapper 
. 
Map 
< 

PatientDTO (
>( )
() *
patient* 1
)1 2
;2 3
} 	
} 
} ≥
äD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\QueryHandlers\GetMedicalRecordsQueryHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
QueryHandlers  -
{ 
public 

class )
GetMedicalRecordsQueryHandler .
:/ 0
IRequestHandler1 @
<@ A"
GetMedicalRecordsQueryA W
,W X
ListY ]
<] ^
MedicalRecordDTO^ n
>n o
>o p
{		 
private

 
readonly

 $
IMedicalRecordRepository

 1

repository

2 <
;

< =
private 
readonly 
IMapper  
mapper! '
;' (
public )
GetMedicalRecordsQueryHandler ,
(, -$
IMedicalRecordRepository- E

repositoryF P
,P Q
IMapperR Y
mapperZ `
)` a
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
List 
< 
MedicalRecordDTO /
>/ 0
>0 1
Handle2 8
(8 9"
GetMedicalRecordsQuery9 O
requestP W
,W X
CancellationTokenY j
cancellationTokenk |
)| }
{ 	
var 
records 
= 
await 

repository  *
.* +"
GetMedicalRecordsAsync+ A
(A B
)B C
;C D
return 
mapper 
. 
Map 
< 
List "
<" #
MedicalRecordDTO# 3
>3 4
>4 5
(5 6
records6 =
)= >
;> ?
} 	
} 
} ±
çD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\QueryHandlers\GetMedicalRecordByIdQueryHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
QueryHandlers  -
{ 
public		 

class		 ,
 GetMedicalRecordByIdQueryHandler		 1
:		2 3
IRequestHandler		4 C
<		C D%
GetMedicalRecordByIdQuery		D ]
,		] ^
MedicalRecordDTO		_ o
>		o p
{

 
public 
readonly $
IMedicalRecordRepository 0

repository1 ;
;; <
public 
readonly 
IMapper 
mapper  &
;& '
public ,
 GetMedicalRecordByIdQueryHandler /
(/ 0$
IMedicalRecordRepository0 H

repositoryI S
,S T
IMapperU \
mapper] c
)c d
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
MedicalRecordDTO *
>* +
Handle, 2
(2 3%
GetMedicalRecordByIdQuery3 L
requestM T
,T U
CancellationTokenV g
cancellationTokenh y
)y z
{ 	
var 
medicalRecord 
= 
await  %

repository& 0
.0 1%
GetMedicalRecordByIdAsync1 J
(J K
requestK R
.R S
IdS U
)U V
;V W
if 
( 
medicalRecord 
==  
null! %
)% &
{ 
return 
null 
; 
} 
return 
mapper 
. 
Map 
< 
MedicalRecordDTO .
>. /
(/ 0
medicalRecord0 =
)= >
;> ?
} 	
} 
} •
áD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\QueryHandlers\GetAppointmentQueryHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
QueryHandlers  -
{ 
public		 

class		 &
GetAppointmentQueryHandler		 +
:		, -
IRequestHandler		. =
<		= >
GetAppointmentQuery		> Q
,		Q R
List		S W
<		W X
AppointmentDTO		X f
>		f g
>		g h
{

 
private 
readonly "
IAppointmentRepository /

repository0 :
;: ;
private 
readonly 
IMapper  
mapper! '
;' (
public &
GetAppointmentQueryHandler )
() *"
IAppointmentRepository* @

repositoryA K
,K L
IMapperM T
mapperU [
)[ \
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
List 
< 
AppointmentDTO -
>- .
>. /
Handle0 6
(6 7
GetAppointmentQuery7 J
requestK R
,R S
CancellationTokenT e
cancellationTokenf w
)w x
{ 	
var 
appointments 
= 
await $

repository% /
./ 0#
GetAllAppointmentsAsync0 G
(G H
)H I
;I J
return 
mapper 
. 
Map 
< 
List "
<" #
AppointmentDTO# 1
>1 2
>2 3
(3 4
appointments4 @
)@ A
;A B
} 	
} 
} ≤
ãD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\QueryHandlers\GetAppointmentByIdQueryHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
QueryHandlers  -
{ 
public		 

class		 *
GetAppointmentByIdQueryHandler		 /
:		0 1
IRequestHandler		2 A
<		A B#
GetAppointmentByIdQuery		B Y
,		Y Z
AppointmentDTO		[ i
>		i j
{

 
public 
readonly "
IAppointmentRepository .

repository/ 9
;9 :
public 
readonly 
IMapper 
mapper  &
;& '
public *
GetAppointmentByIdQueryHandler -
(- ."
IAppointmentRepository. D

repositoryE O
,O P
IMapperQ X
mapperY _
)_ `
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
AppointmentDTO (
>( )
Handle* 0
(0 1#
GetAppointmentByIdQuery1 H
queryI N
,N O
CancellationTokenP a
cancellationTokenb s
)s t
{ 	
var 
appointment 
= 
await #
this$ (
.( )

repository) 3
.3 4#
GetAppointmentByIdAsync4 K
(K L
queryL Q
.Q R
IdR T
)T U
;U V
if 
( 
appointment 
== 
null #
)# $
{ 
return 
null 
; 
}   
return"" 
mapper"" 
."" 
Map"" 
<"" 
AppointmentDTO"" ,
>"", -
(""- .
appointment"". 9
)""9 :
;"": ;
}## 	
}%% 
}&& Ê
wD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Queries\GetPatientsQuery.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Queries  '
{ 
public 

class 
GetPatientsQuery !
:" #
IRequest$ ,
<, -
List- 1
<1 2

PatientDTO2 <
>< =
>= >
{ 
public		 
Guid		 
	PatientId		 
{		 
get		  #
;		# $
set		% (
;		( )
}		* +
public

 
string

 
	FirstName
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
public 
string 
LastName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
DateTime 
DateOfBirth #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
Gender 
Gender 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
ContactInformation (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
Address 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	PhotoPath 
{  !
get" %
;% &
set' *
;* +
}, -
} 
} „
zD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Queries\GetPatientByIdQuery.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Queries  '
{ 
public 

class 
GetPatientByIdQuery $
:% &
IRequest' /
</ 0

PatientDTO0 :
>: ;
{ 
public 
Guid 
Id 
{ 
get 
; 
set !
;! "
}# $
}		 
}

 ˛
}D:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Queries\GetMedicalRecordsQuery.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Queries  '
{ 
public 

class "
GetMedicalRecordsQuery '
:( )
IRequest* 2
<2 3
List3 7
<7 8
MedicalRecordDTO8 H
>H I
>I J
{ 
public		 
Guid		 
RecordId		 
{		 
get		 "
;		" #
set		$ '
;		' (
}		) *
public

 
Guid

 
	PatientId

 
{

 
get

  #
;

# $
set

% (
;

( )
}

* +
public 
DateTime 
Date 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
	Diagnosis 
{  !
get" %
;% &
set' *
;* +
}, -
public 
List 
< 
Prescription  
>  !
Prescriptions" /
{0 1
get2 5
;5 6
set7 :
;: ;
}< =
=> ?
new@ C
ListD H
<H I
PrescriptionI U
>U V
(V W
)W X
;X Y
public 
string 
Notes 
{ 
get !
;! "
set# &
;& '
}( )
} 
} ˆ
ÄD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Queries\GetMedicalRecordByIdQuery.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Queries  '
{ 
public 

class %
GetMedicalRecordByIdQuery *
:+ ,
IRequest- 5
<5 6
MedicalRecordDTO6 F
>F G
{ 
public 
Guid 
Id 
{ 
get 
; 
set !
;! "
}# $
}		 
}

 Ω
zD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Queries\GetAppointmentQuery.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Queries  '
{ 
public 

class 
GetAppointmentQuery $
:% &
IRequest' /
</ 0
List0 4
<4 5
AppointmentDTO5 C
>C D
>D E
{ 
public		 
Guid		 
AppointmentId		 !
{		" #
get		$ '
;		' (
set		) ,
;		, -
}		. /
public

 
Guid

 
	PatientId

 
{

 
get

  #
;

# $
set

% (
;

( )
}

* +
public 
Guid 

ProviderId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
DateTime 
AppointmentDate '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
Reason 
{ 
get "
;" #
set$ '
;' (
}) *
public 
AppointmentStatus  
Status! '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} Ô
~D:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Queries\GetAppointmentByIdQuery.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Queries  '
{ 
public 

class #
GetAppointmentByIdQuery (
:) *
IRequest+ 3
<3 4
AppointmentDTO4 B
>B C
{ 
public		 
Guid		 
Id		 
{		 
get		 
;		 
set		 !
;		! "
}		# $
}

 
} ¶
ÖD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\UpdatePatientCommandValidator.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class )
UpdatePatientCommandValidator .
:/ 0
AbstractValidator1 B
<B C 
UpdatePatientCommandC W
>W X
{ 
public )
UpdatePatientCommandValidator ,
(, -
)- .
{ 	
RuleFor		 
(		 
p		 
=>		 
p		 
.		 
	PatientId		 $
)		$ %
.

 
NotEmpty

 
(

 
)

 
. 
Must 
( 
BeAValidGuid "
)" #
. 
WithMessage 
( 
$str =
)= >
;> ?
RuleFor 
( 
p 
=> 
p 
. 
	FirstName $
)$ %
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 6
)6 7
. 
MaximumLength 
( 
$num "
)" #
;# $
RuleFor 
( 
p 
=> 
p 
. 
LastName #
)# $
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 5
)5 6
. 
MaximumLength 
( 
$num "
)" #
;# $
RuleFor 
( 
p 
=> 
p 
. 
DateOfBirth &
)& '
. 
NotEmpty 
( 
) 
. 
LessThan 
( 
DateTime "
." #
Now# &
)& '
. 
WithMessage 
( 
$str A
)A B
;B C
RuleFor 
( 
p 
=> 
p 
. 
Gender !
)! "
. 
NotNull 
( 
) 
. 
WithMessage 
( 
$str 2
)2 3
;3 4
RuleFor!! 
(!! 
p!! 
=>!! 
p!! 
.!! 
ContactInformation!! -
)!!- .
."" 
NotEmpty"" 
("" 
)"" 
.## 
WithMessage## 
(## 
$str## ?
)##? @
.$$ 
MaximumLength$$ 
($$ 
$num$$ "
)$$" #
;$$# $
RuleFor&& 
(&& 
p&& 
=>&& 
p&& 
.&& 
Address&& "
)&&" #
.'' 
NotEmpty'' 
('' 
)'' 
.(( 
WithMessage(( 
((( 
$str(( 3
)((3 4
.)) 
MaximumLength)) 
()) 
$num)) "
)))" #
;))# $
}** 	
private,, 
bool,, 
BeAValidGuid,, !
(,,! "
Guid,," &
guid,,' +
),,+ ,
{-- 	
return.. 
Guid.. 
... 
TryParse..  
(..  !
guid..! %
...% &
ToString..& .
(... /
)../ 0
,..0 1
out..2 5
_..6 7
)..7 8
;..8 9
}// 	
}00 
}11 ∫
|D:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\UpdatePatientCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class  
UpdatePatientCommand %
:& '
IRequest( 0
<0 1
Unit1 5
>5 6
{ 
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public		 
string		 
	FirstName		 
{		  !
get		" %
;		% &
set		' *
;		* +
}		, -
public

 
string

 
LastName

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
public 
DateTime 
DateOfBirth #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
Gender 
Gender 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
ContactInformation (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
Address 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	PhotoPath 
{  !
get" %
;% &
set' *
;* +
}, -
} 
} â
ãD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\UpdateMedicalRecordCommandValidator.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{		 
public

 

class

 /
#UpdateMedicalRecordCommandValidator

 4
:

5 6
AbstractValidator

7 H
<

H I&
UpdateMedicalRecordCommand

I c
>

c d
{ 
private 
readonly 
IPatientRepository +
_patientRepository, >
;> ?
private 
bool 
PatientExists "
(" #
Guid# '
	patientId( 1
)1 2
{ 	
return 
_patientRepository %
.% &
PatientExistsAsync& 8
(8 9
	patientId9 B
)B C
.C D

GetAwaiterD N
(N O
)O P
.P Q
	GetResultQ Z
(Z [
)[ \
;\ ]
} 	
public /
#UpdateMedicalRecordCommandValidator 2
(2 3
IPatientRepository3 E
patientRepositoryF W
)W X
{Y Z
_patientRepository 
=  
patientRepository! 2
;2 3
RuleFor 
( 
x 
=> 
x 
. 
RecordId #
)# $
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str C
)C D
;D E
RuleFor 
( 
x 
=> 
x 
. 
	PatientId $
)$ %
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str <
)< =
. 
Must 
( 
PatientExists #
)# $
. 
WithMessage 
( 
$str 9
)9 :
;: ;
RuleFor 
( 
p 
=> 
p 
. 
Date 
)  
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 0
)0 1
. 
LessThanOrEqualTo "
(" #
DateTime# +
.+ ,
Now, /
)/ 0
.   
WithMessage   
(   
$str   C
)  C D
;  D E
RuleFor!! 
(!! 
x!! 
=>!! 
x!! 
.!! 
	Diagnosis!! $
)!!$ %
."" 
NotEmpty"" 
("" 
)"" 
.## 
WithMessage## 
(## 
$str## 4
)##4 5
.$$ 
MaximumLength$$ 
($$ 
$num$$ !
)$$! "
;$$" #
RuleFor%% 
(%% 
x%% 
=>%% 
x%% 
.%% 
Notes%%  
)%%  !
.&& 
MaximumLength&& 
(&& 
$num&& #
)&&# $
;&&$ %
}'' 	
}(( 
})) ﬂ	
ÇD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\UpdateMedicalRecordCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class &
UpdateMedicalRecordCommand +
:, -
IRequest. 6
<6 7
Unit7 ;
>; <
{ 
public 
Guid 
RecordId 
{ 
get "
;" #
set$ '
;' (
}) *
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public		 
DateTime		 
Date		 
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
	Diagnosis
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
public 
string 
Notes 
{ 
get !
;! "
set# &
;& '
}( )
} 
} ò
âD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\UpdateAppointmentCommandValidator.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class -
!UpdateAppointmentCommandValidator 2
:3 4
AbstractValidator5 F
<F G$
UpdateAppointmentCommandG _
>_ `
{ 
private 
readonly 
IPatientRepository +
_patientRepository, >
;> ?
private 
bool 
PatientExists "
(" #
Guid# '
	patientId( 1
)1 2
{ 	
return 
_patientRepository %
.% &
PatientExistsAsync& 8
(8 9
	patientId9 B
)B C
.C D

GetAwaiterD N
(N O
)O P
.P Q
	GetResultQ Z
(Z [
)[ \
;\ ]
} 	
public -
!UpdateAppointmentCommandValidator 0
(0 1
IPatientRepository1 C
patientRepositoryD U
)U V
{ 	
_patientRepository 
=  
patientRepository! 2
;2 3
RuleFor 
( 
x 
=> 
x 
. 
AppointmentId (
)( )
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str @
)@ A
;A B
RuleFor 
( 
x 
=> 
x 
. 
	PatientId $
)$ %
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str <
)< =
. 
Must 
( 
PatientExists #
)# $
. 
WithMessage 
( 
$str 9
)9 :
;: ;
RuleFor 
( 
x 
=> 
x 
. 

ProviderId %
)% &
. 
NotEmpty 
( 
) 
.   
WithMessage   
(   
$str   =
)  = >
;  > ?
RuleFor"" 
("" 
x"" 
=>"" 
x"" 
."" 
AppointmentDate"" *
)""* +
.## 
NotEmpty## 
(## 
)## 
.$$ 
WithMessage$$ 
($$ 
$str$$ <
)$$< =
.%%  
GreaterThanOrEqualTo%% %
(%%% &
DateTime%%& .
.%%. /
Now%%/ 2
)%%2 3
.&& 
WithMessage&& 
(&& 
$str&& F
)&&F G
;&&G H
RuleFor(( 
((( 
x(( 
=>(( 
x(( 
.(( 
Reason(( !
)((! "
.)) 
NotEmpty)) 
()) 
))) 
.** 
WithMessage** 
(** 
$str** F
)**F G
.++ 
MaximumLength++ 
(++ 
$num++ "
)++" #
.,, 
WithMessage,, 
(,, 
$str,, C
),,C D
;,,D E
RuleFor.. 
(.. 
x.. 
=>.. 
x.. 
... 
Status.. !
)..! "
.// 
InclusiveBetween// !
(//! "
$num//" #
,//# $
$num//% &
)//& '
.00 
WithMessage00 
(00 
$str00 T
)00T U
;00U V
}11 	
}22 
}33 Ç
ÄD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\UpdateAppointmentCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class $
UpdateAppointmentCommand )
:* +
IRequest, 4
<4 5
Unit5 9
>9 :
{ 
public 
Guid 
AppointmentId !
{" #
get$ '
;' (
set) ,
;, -
}. /
public		 
Guid		 
	PatientId		 
{		 
get		  #
;		# $
set		% (
;		( )
}		* +
public

 
Guid

 

ProviderId

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
public 
DateTime 
AppointmentDate '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
Reason 
{ 
get "
;" #
set$ '
;' (
}) *
public 
int 
Status 
{ 
get 
;  
set! $
;$ %
}& '
} 
} Ö
ÖD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\DeletePatientCommandValidator.cs
public 
class )
DeletePatientCommandValidator *
:+ ,
AbstractValidator- >
<> ? 
DeletePatientCommand? S
>S T
{ 
public 
)
DeletePatientCommandValidator (
(( )
)) *
{ 
RuleFor 
( 
x 
=> 
x 
. 
Id 
) 
.		 
NotEmpty		 
(		 
)		 
.

 
WithMessage

 
(

 
$str

 8
)

8 9
;

9 :
} 
} ·
|D:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\DeletePatientCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class  
DeletePatientCommand %
:& '
IRequest( 0
<0 1
Unit1 5
>5 6
{ 
public 
Guid 
Id 
{ 
get 
; 
set !
;! "
}# $
} 
}		 ∂
ãD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\DeleteMedicalRecordCommandValidator.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class /
#DeleteMedicalRecordCommandValidator 4
:5 6
AbstractValidator7 H
<H I&
DeleteMedicalRecordCommandI c
>c d
{ 
public /
#DeleteMedicalRecordCommandValidator 2
(2 3
)3 4
{ 	
RuleFor		 
(		 
x		 
=>		 
x		 
.		 
Id		 
)		 
.

 
NotEmpty

 
(

 
)

 
. 
WithMessage 
( 
$str <
)< =
;= >
} 	
} 
} Ó
ÇD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\DeleteMedicalRecordCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class &
DeleteMedicalRecordCommand +
:, -
IRequest. 6
<6 7
Unit7 ;
>; <
{ 
public 
Guid 
Id 
{ 
get 
; 
set !
;! "
}# $
} 
}		 Æ
âD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\DeleteAppointmentCommandValidator.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class -
!DeleteAppointmentCommandValidator 2
:3 4
AbstractValidator5 F
<F G$
DeleteAppointmentCommandG _
>_ `
{ 
public -
!DeleteAppointmentCommandValidator 0
(0 1
)1 2
{ 	
RuleFor		 
(		 
x		 
=>		 
x		 
.		 
Id		 
)		 
.

 
NotEmpty

 
(

 
)

 
. 
WithMessage 
( 
$str @
)@ A
;A B
} 	
} 
} Í
ÄD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\DeleteAppointmentCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class $
DeleteAppointmentCommand )
:* +
IRequest, 4
<4 5
Unit5 9
>9 :
{ 
public 
Guid 
Id 
{ 
get 
; 
set !
;! "
}# $
} 
}		 Ü
ÖD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\CreatePatientCommandValidator.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public 

class )
CreatePatientCommandValidator .
:/ 0
AbstractValidator1 B
<B C 
CreatePatientCommandC W
>W X
{ 
public )
CreatePatientCommandValidator ,
(, -
)- .
{		 	
RuleFor

 
(

 
p

 
=>

 
p

 
.

 
	FirstName

 $
)

$ %
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 6
)6 7
. 
MaximumLength 
( 
$num "
)" #
;# $
RuleFor 
( 
p 
=> 
p 
. 
LastName #
)# $
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 5
)5 6
. 
MaximumLength 
( 
$num "
)" #
;# $
RuleFor 
( 
p 
=> 
p 
. 
DateOfBirth &
)& '
. 
NotEmpty 
( 
) 
. 
LessThan 
( 
DateTime "
." #
Now# &
)& '
. 
WithMessage 
( 
$str A
)A B
;B C
RuleFor 
( 
p 
=> 
p 
. 
Gender !
)! "
. 
NotNull 
( 
) 
. 
WithMessage 
( 
$str 2
)2 3
;3 4
RuleFor 
( 
p 
=> 
p 
. 
ContactInformation -
)- .
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str ?
)? @
.   
MaximumLength   
(   
$num   "
)  " #
;  # $
RuleFor"" 
("" 
p"" 
=>"" 
p"" 
."" 
Address"" "
)""" #
.## 
NotEmpty## 
(## 
)## 
.$$ 
WithMessage$$ 
($$ 
$str$$ 3
)$$3 4
.%% 
MaximumLength%% 
(%% 
$num%% "
)%%" #
;%%# $
}&& 	
}'' 
}(( ü
|D:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\CreatePatientCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class  
CreatePatientCommand %
:& '
IRequest( 0
<0 1
Guid1 5
>5 6
{ 
public 
string 
	FirstName 
{  !
get" %
;% &
set' *
;* +
}, -
public		 
string		 
LastName		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
public

 
DateTime

 
DateOfBirth

 #
{

$ %
get

& )
;

) *
set

+ .
;

. /
}

0 1
public 
Gender 
Gender 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
ContactInformation (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
Address 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	PhotoPath 
{  !
get" %
;% &
set' *
;* +
}, -
} 
} ∫
ãD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\CreateMedicalRecordCommandValidator.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class /
#CreateMedicalRecordCommandValidator 4
:5 6
AbstractValidator7 H
<H I&
CreateMedicalRecordCommandI c
>c d
{ 
public /
#CreateMedicalRecordCommandValidator 2
(2 3
)3 4
{		 	
RuleFor

 
(

 
x

 
=>

 
x

 
.

 
	PatientId

 $
)

$ %
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 6
)6 7
;7 8
RuleFor 
( 
x 
=> 
x 
. 
Date 
)  
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 0
)0 1
. 
LessThanOrEqualTo "
(" #
DateTime# +
.+ ,
Now, /
)/ 0
. 
WithMessage 
( 
$str C
)C D
;D E
RuleFor 
( 
x 
=> 
x 
. 
	Diagnosis $
)$ %
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 5
)5 6
. 
MaximumLength 
( 
$num "
)" #
;# $
RuleFor   
(   
x   
=>   
x   
.   
Notes    
)    !
.!! 
MaximumLength!! 
(!! 
$num!! #
)!!# $
;!!$ %
}"" 	
}## 
}II ≈
ÇD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\CreateMedicalRecordCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class &
CreateMedicalRecordCommand +
:, -
IRequest. 6
<6 7
Guid7 ;
>; <
{ 
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public		 
DateTime		 
Date		 
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
	Diagnosis
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
public 
string 
Notes 
{ 
get !
;! "
set# &
;& '
}( )
} 
} œ
âD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\CreateAppointmentCommandValidator.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class -
!CreateAppointmentCommandValidator 2
:3 4
AbstractValidator5 F
<F G$
CreateAppointmentCommandG _
>_ `
{ 
public -
!CreateAppointmentCommandValidator 0
(0 1
)1 2
{		 	
RuleFor

 
(

 
p

 
=>

 
p

 
.

 
	PatientId

 $
)

$ %
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 6
)7 8
;8 9
RuleFor 
( 
p 
=> 
p 
. 

ProviderId %
)% &
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 7
)7 8
;8 9
RuleFor 
( 
p 
=> 
p 
. 
AppointmentDate *
)* +
. 
NotEmpty 
( 
) 
. 
GreaterThan 
( 
DateTime %
.% &
Now& )
)) *
. 
WithMessage 
( 
$str G
)G H
;H I
RuleFor 
( 
p 
=> 
p 
. 
Reason !
)! "
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 2
)2 3
. 
MaximumLength 
( 
$num "
)" #
;# $
RuleFor 
( 
p 
=> 
p 
. 
Status !
)! "
. 
NotNull 
( 
) 
. 
WithMessage 
( 
$str 2
)2 3
;3 4
} 	
} 
} Ò	
ÄD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\Commands\CreateAppointmentCommand.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
Commands  (
{ 
public 

class $
CreateAppointmentCommand )
:* +
IRequest, 4
<4 5
Guid5 9
>9 :
{ 
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public		 
Guid		 

ProviderId		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
public

 
DateTime

 
AppointmentDate

 '
{

( )
get

* -
;

- .
set

/ 2
;

2 3
}

4 5
public 
string 
Reason 
{ 
get "
;" #
set$ '
;' (
}) *
public 
AppointmentStatus  
Status! '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} ¨
äD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\UpdatePatientCommandHandler.cs
	namespace 	
Application
 
. 
CommandHandlers %
{ 
public 

class '
UpdatePatientCommandHandler ,
:- .
IRequestHandler/ >
<> ? 
UpdatePatientCommand? S
,S T
UnitU Y
>Y Z
{		 
private

 
readonly

 
IPatientRepository

 +

repository

, 6
;

6 7
private 
readonly 
IMapper  
mapper! '
;' (
public '
UpdatePatientCommandHandler *
(* +
IPatientRepository+ =

repository> H
,H I
IMapperJ Q
mapperR X
)X Y
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
Unit 
> 
Handle  &
(& ' 
UpdatePatientCommand' ;
request< C
,C D
CancellationTokenE V
cancellationTokenW h
)h i
{ 	
var 
existingPatient 
=  !
await" '

repository( 2
.2 3
GetPatientByIdAsync3 F
(F G
requestG N
.N O
	PatientIdO X
)X Y
;Y Z
if 
( 
existingPatient 
==  "
null# '
)' (
{ 
throw 
new  
KeyNotFoundException .
(. /
$str/ B
)B C
;C D
} 

repository 
. 
Detach 
( 
existingPatient -
)- .
;. /
var 
patient 
= 
mapper  
.  !
Map! $
<$ %
Patient% ,
>, -
(- .
request. 5
)5 6
;6 7
await 

repository 
. 
UpdateAsync (
(( )
patient) 0
)0 1
;1 2
return!! 
Unit!! 
.!! 
Value!! 
;!! 
}"" 	
}## 
}$$ Ç
êD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\UpdateMedicalRecordCommandHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public 

class -
!UpdateMedicalRecordCommandHandler 2
:3 4
IRequestHandler5 D
<D E&
UpdateMedicalRecordCommandE _
,_ `
Unita e
>e f
{ 
private 
readonly $
IMedicalRecordRepository 1

repository2 <
;< =
private 
readonly 
IMapper  
mapper! '
;' (
public -
!UpdateMedicalRecordCommandHandler 0
(0 1$
IMedicalRecordRepository1 I

repositoryJ T
,T U
IMapperV ]
mapper^ d
)d e
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
Unit 
> 
Handle  &
(& '&
UpdateMedicalRecordCommand' A
requestB I
,I J
CancellationTokenK \
cancellationToken] n
)n o
{ 	
var 
existingRecord 
=  
await! &

repository' 1
.1 2%
GetMedicalRecordByIdAsync2 K
(K L
requestL S
.S T
RecordIdT \
)\ ]
;] ^
if 
( 
existingRecord 
== !
null" &
)& '
{ 
throw 
new  
KeyNotFoundException .
(. /
$str/ A
)A B
;B C
} 

repository 
. 
Detach 
( 
existingRecord ,
), -
;- .
var!! 
record!! 
=!! 
mapper!! 
.!!  
Map!!  #
<!!# $
MedicalRecord!!$ 1
>!!1 2
(!!2 3
request!!3 :
)!!: ;
;!!; <
await"" 

repository"" 
."" 
UpdateAsync"" (
(""( )
record"") /
)""/ 0
;""0 1
return$$ 
Unit$$ 
.$$ 
Value$$ 
;$$ 
}%% 	
}&& 
}'' Ì
éD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\UpdateAppointmentCommandHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public 

class +
UpdateAppointmentCommandHandler 0
:1 2
IRequestHandler3 B
<B C$
UpdateAppointmentCommandC [
,[ \
Unit] a
>a b
{ 
private 
readonly "
IAppointmentRepository /
_repository0 ;
;; <
private 
readonly 
IMapper  
_mapper! (
;( )
public +
UpdateAppointmentCommandHandler .
(. /"
IAppointmentRepository/ E

repositoryF P
,P Q
IMapperR Y
mapperZ `
)` a
{ 	
_repository 
= 

repository $
;$ %
_mapper 
= 
mapper 
; 
} 	
public 
async 
Task 
< 
Unit 
> 
Handle  &
(& '$
UpdateAppointmentCommand' ?
request@ G
,G H
CancellationTokenI Z
cancellationToken[ l
)l m
{ 	
var 
existingAppointment #
=$ %
await& +
_repository, 7
.7 8#
GetAppointmentByIdAsync8 O
(O P
requestP W
.W X
AppointmentIdX e
)e f
;f g
if 
( 
existingAppointment #
==$ &
null' +
)+ ,
{ 
throw 
new  
KeyNotFoundException .
(. /
$str/ F
)F G
;G H
} 
_repository"" 
."" 
Detach"" 
("" 
existingAppointment"" 2
)""2 3
;""3 4
var%% 
updatedAppointment%% "
=%%# $
_mapper%%% ,
.%%, -
Map%%- 0
<%%0 1
Appointment%%1 <
>%%< =
(%%= >
request%%> E
)%%E F
;%%F G
await(( 
_repository(( 
.(( "
UpdateAppointmentAsync(( 4
(((4 5
updatedAppointment((5 G
)((G H
;((H I
return** 
Unit** 
.** 
Value** 
;** 
}++ 	
},, 
}-- å
äD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\DeletePatientCommandHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public 

class '
DeletePatientCommandHandler ,
:- .
IRequestHandler/ >
<> ? 
DeletePatientCommand? S
,S T
UnitU Y
>Y Z
{ 
private 
readonly 
IPatientRepository +

repository, 6
;6 7
public

 '
DeletePatientCommandHandler

 *
(

* +
IPatientRepository

+ =

repository

> H
)

H I
{ 	
this 
. 

repository 
= 

repository (
;( )
} 	
public 
async 
Task 
< 
Unit 
> 
Handle  &
(& ' 
DeletePatientCommand' ;
request< C
,C D
CancellationTokenE V
cancellationTokenW h
)h i
{ 	
var 
existingPatient 
=  !
await" '

repository( 2
.2 3
GetPatientByIdAsync3 F
(F G
requestG N
.N O
IdO Q
)Q R
;R S
if 
( 
existingPatient 
==  "
null# '
)' (
{ 
throw 
new  
KeyNotFoundException .
(. /
$str/ B
)B C
;C D
} 
await 

repository 
. 
DeletePatientAsync /
(/ 0
request0 7
.7 8
Id8 :
): ;
;; <
return 
Unit 
. 
Value 
; 
} 	
} 
} Œ
êD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\DeleteMedicalRecordCommandHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public 

class -
!DeleteMedicalRecordCommandHandler 2
:3 4
IRequestHandler5 D
<D E&
DeleteMedicalRecordCommandE _
,_ `
Unita e
>e f
{ 
private 
readonly $
IMedicalRecordRepository 1

repository2 <
;< =
public

 -
!DeleteMedicalRecordCommandHandler

 0
(

0 1$
IMedicalRecordRepository

1 I

repository

J T
)

T U
{ 	
this 
. 

repository 
= 

repository (
;( )
} 	
public 
async 
Task 
< 
Unit 
> 
Handle  &
(& '&
DeleteMedicalRecordCommand' A
requestB I
,I J
CancellationTokenK \
cancellationToken] n
)n o
{ 	
var !
existingMedicalRecord %
=& '
await( -

repository. 8
.8 9%
GetMedicalRecordByIdAsync9 R
(R S
requestS Z
.Z [
Id[ ]
)] ^
;^ _
if 
( !
existingMedicalRecord %
==& (
null) -
)- .
{ 
throw 
new  
KeyNotFoundException .
(. /
$str/ I
)I J
;J K
} 
await 

repository 
. $
DeleteMedicalRecordAsync 5
(5 6
request6 =
.= >
Id> @
)@ A
;A B
return 
Unit 
. 
Value 
; 
} 	
} 
} ∏
éD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\DeleteAppointmentCommandHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public 

class +
DeleteAppointmentCommandHandler 0
:1 2
IRequestHandler3 B
<B C$
DeleteAppointmentCommandC [
,[ \
Unit] a
>a b
{ 
private		 
readonly		 "
IAppointmentRepository		 /

repository		0 :
;		: ;
public +
DeleteAppointmentCommandHandler .
(. /"
IAppointmentRepository/ E

repositoryF P
)P Q
{ 	
this 
. 

repository 
= 

repository (
;( )
} 	
public 
async 
Task 
< 
Unit 
> 
Handle  &
(& '$
DeleteAppointmentCommand' ?
request@ G
,G H
CancellationTokenI Z
cancellationToken[ l
)l m
{ 	
var 
existingAppointment #
=$ %
await& +

repository, 6
.6 7#
GetAppointmentByIdAsync7 N
(N O
requestO V
.V W
IdW Y
)Y Z
;Z [
if 
( 
existingAppointment #
==$ &
null' +
)+ ,
{ 
throw 
new  
KeyNotFoundException .
(. /
$str/ F
)F G
;G H
} 
await 

repository 
. "
DeleteAppointmentAsync 3
(3 4
request4 ;
.; <
Id< >
)> ?
;? @
return 
Unit 
. 
Value 
; 
} 	
} 
} ˛
äD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\CreatePatientCommandHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public 

class '
CreatePatientCommandHandler ,
:- .
IRequestHandler/ >
<> ? 
CreatePatientCommand? S
,S T
GuidU Y
>Y Z
{		 
private

 
readonly

 
IPatientRepository

 +

repository

, 6
;

6 7
private 
readonly 
IMapper  
mapper! '
;' (
public '
CreatePatientCommandHandler *
(* +
IPatientRepository+ =

repository> H
,H I
IMapperJ Q
mapperR X
)X Y
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
Guid 
> 
Handle  &
(& ' 
CreatePatientCommand' ;
request< C
,C D
CancellationTokenE V
cancellationTokenW h
)h i
{ 	
var 
patient 
= 
mapper  
.  !
Map! $
<$ %
Patient% ,
>, -
(- .
request. 5
)5 6
;6 7
return 
await 

repository #
.# $
AddPatientAsync$ 3
(3 4
patient4 ;
); <
;< =
} 	
} 
} ≤
êD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\CreateMedicalRecordCommandHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public 

class -
!CreateMedicalRecordCommandHandler 2
:3 4
IRequestHandler5 D
<D E&
CreateMedicalRecordCommandE _
,_ `
Guida e
>e f
{		 
private

 
readonly

 $
IMedicalRecordRepository

 1

repository

2 <
;

< =
private 
readonly 
IMapper  
mapper! '
;' (
public -
!CreateMedicalRecordCommandHandler 0
(0 1$
IMedicalRecordRepository1 I

repositoryJ T
,T U
IMapperV ]
mapper^ d
)d e
{ 	
this 
. 

repository 
= 

repository (
;( )
this 
. 
mapper 
= 
mapper  
;  !
} 	
public 
async 
Task 
< 
Guid 
> 
Handle  &
(& '&
CreateMedicalRecordCommand' A
requestB I
,I J
CancellationTokenK \
cancellationToken] n
)n o
{ 	
var 
record 
= 
mapper 
.  
Map  #
<# $
MedicalRecord$ 1
>1 2
(2 3
request3 :
): ;
;; <
return 
await 

repository #
.# $!
AddMedicalRecordAsync$ 9
(9 :
record: @
)@ A
;A B
} 	
} 
} –
éD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\Use Cases\CommandHandlers\CreateAppointmentCommandHandler.cs
	namespace 	
Application
 
. 
	Use_Cases 
.  
CommandHandlers  /
{ 
public		 

class		 +
CreateAppointmentCommandHandler		 0
:		1 2
IRequestHandler		3 B
<		B C$
CreateAppointmentCommand		C [
,		[ \
Guid		] a
>		a b
{

 
private 
readonly "
IAppointmentRepository /"
_appointmentRepository0 F
;F G
private 
readonly 
IPatientRepository +
_patientRepository, >
;> ?
private 
readonly 
IMapper  
_mapper! (
;( )
public +
CreateAppointmentCommandHandler .
(. /"
IAppointmentRepository/ E!
appointmentRepositoryF [
,[ \
IPatientRepository] o
patientRepository	p Å
,
Å Ç
IMapper
É ä
mapper
ã ë
)
ë í
{ 	"
_appointmentRepository "
=# $!
appointmentRepository% :
;: ;
_patientRepository 
=  
patientRepository! 2
;2 3
_mapper 
= 
mapper 
; 
} 	
public 
async 
Task 
< 
Guid 
> 
Handle  &
(& '$
CreateAppointmentCommand' ?
request@ G
,G H
CancellationTokenI Z
cancellationToken[ l
)l m
{ 	
var 
patient 
= 
await 
_patientRepository  2
.2 3
GetPatientByIdAsync3 F
(F G
requestG N
.N O
	PatientIdO X
)X Y
;Y Z
if 
( 
patient 
== 
null 
)  
{ 
throw 
new 
	Exception #
(# $
$str$ 7
)7 8
;8 9
} 
var 
appointment 
= 
_mapper %
.% &
Map& )
<) *
Appointment* 5
>5 6
(6 7
request7 >
)> ?
;? @
return 
await "
_appointmentRepository /
./ 0
AddAppointmentAsync0 C
(C D
appointmentD O
)O P
;P Q
}   	
}!! 
}"" ô
dD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\DTOs\PatientDTO.cs
	namespace 	
Application
 
. 
DTOs 
{ 
public 

class 

PatientDTO 
{ 
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	FirstName 
{  !
get" %
;% &
set' *
;* +
}, -
public		 
string		 
LastName		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
public

 
DateTime

 
DateOfBirth

 #
{

$ %
get

& )
;

) *
set

+ .
;

. /
}

0 1
public 
Gender 
Gender 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
ContactInformation (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
Address 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	PhotoPath 
{  !
get" %
;% &
set' *
;* +
}, -
} 
} Ω
jD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\DTOs\MedicalRecordDTO.cs
	namespace 	
Application
 
. 
DTOs 
{ 
public 

class 
MedicalRecordDTO !
{ 
public 
Guid 
RecordId 
{ 
get "
;" #
set$ '
;' (
}) *
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public		 
DateTime		 
Date		 
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
	Diagnosis
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
public 
string 
Notes 
{ 
get !
;! "
set# &
;& '
}( )
} 
} Ó	
hD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\DTOs\AppointmentDTO.cs
	namespace 	
Application
 
. 
DTOs 
{ 
public 

class 
AppointmentDTO 
{ 
public 
Guid 
AppointmentId !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
Guid 
	PatientId 
{ 
get  #
;# $
set% (
;( )
}* +
public		 
Guid		 

ProviderId		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
public

 
DateTime

 
AppointmentDate

 '
{

( )
get

* -
;

- .
set

/ 2
;

2 3
}

4 5
public 
string 
Reason 
{ 
get "
;" #
set$ '
;' (
}) *
public 
AppointmentStatus  
Status! '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} à
hD:\FII-2024-2025\.NET\PROIECT\Predictive-Healthcare-Management-System\Application\DependencyInjection.cs
	namespace		 	
Application		
 
{

 
public 

static 
class 
DependencyInjection +
{ 
public 
static 
IServiceCollection (
AddApplication) 7
(7 8
this8 <
IServiceCollection= O
servicesP X
)X Y
{ 	
services 
. 
AddAutoMapper "
(" #
typeof# )
() *
MappingProfile* 8
)8 9
)9 :
;: ;
services 
. 

AddMediatR 
(  
cfg  #
=>$ &
cfg' *
.* +(
RegisterServicesFromAssembly+ G
(G H
AssemblyH P
.P Q 
GetExecutingAssemblyQ e
(e f
)f g
)g h
)h i
;i j
services 
. /
#AddValidatorsFromAssemblyContaining 8
<8 9)
CreatePatientCommandValidator9 V
>V W
(W X
)X Y
;Y Z
services 
. 
AddTransient !
(! "
typeof" (
(( )
IPipelineBehavior) :
<: ;
,; <
>< =
)= >
,> ?
typeof@ F
(F G
ValidationBehaviorG Y
<Y Z
,Z [
>[ \
)\ ]
)] ^
;^ _
services 
. 
AddTransient !
<! "$
IMedicalRecordRepository" :
,: ;#
MedicalRecordRepository< S
>S T
(T U
)U V
;V W
return 
services 
; 
} 	
} 
} 