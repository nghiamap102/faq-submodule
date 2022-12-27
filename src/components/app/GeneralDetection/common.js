const carNames = `Abarth
AC
Acura
Adam
Adler
AEC
Aero
Aixam
Albion
Alfa Romeo
Allard
Alpina
Alpine
Alvis
AM General
AMC
Amilcar
Amphicar
Anadol
Apollo
Arctic Cat
Ariel
Armstrong Siddeley
ARO
Artega
ASA
Ascari
Asia
Aspark
Aston Martin
ATS
Audi
Austin
Austin-Healey
Autobianchi
Autozam
BAC
Baojun
Barkas
Bedford
Bentley
Bertone
Besturn
Bisu
Bitter
Bizzarrini
BMW
Bolwell
Bond
Borgward
Brabus
Bricklin
Brilliance
Bristol
BSA
Bufori
Bugatti
Buick
BYD
Cadillac
Callaway
Casalini
Caterham
Caterpillar
CG
Chana
ChangAn
Changhe
Chatenet
Checker
Chery
Chevrolet
Chrysler
Cisitalia
Citroen
Cizeta
Clan
Coachmen
Cowin
Cunningham
CWS
Dacia
Dadi
Daewoo
DAF
Daihatsu
Daimler
Datsun
David Brown
DC
De Tomaso
Delage
Delahaye
DeLorean
Dennis
Derways
DeSoto
Dino
DKW
Dodge
Dome
DongFeng
Donkervoort
DR
DS
Dual-Ghia
Duesenberg
Eagle
East Lancs
Edsel
Elfin
Elva
EMW
Eunos
Exeed
Facel Vega
FAW
Ferrari
Fiat
Fiberfab
Fisker
FMR
Foday
Ford
Fornasari
Foton
FPV
Frazer-Nash
Freightliner
FSC
FSO
Galloper
GAZ
Geely
General Motors
Genesis
Geo
Ghia
Ginetta
GMC
Goggomobil
Gonow
Great Wall
Grinnall
GTM
Gumpert
Gurgel
GWM
Hafei
Haima
Hanteng
Healey
Heinkel
Hennessey
Henry
Hillman
Hindustan
Hino
Holden
Honda
Hongqi
Hotchkiss
HRG
HSV
HuangHai
Hudson
Humber
Hummer
Hyundai
IFA
IKA
Imperial
Infiniti
Innocenti
Intermeccanica
International Harvester
Invicta
Iran Khodro
Irmscher
Isdera
Iso
Isuzu
Italdesign
Iveco
Izh
JAC
Jaguar
Jeep
Jensen
Jetour
Jiefang
Jiotto
JMC
John Deere
Jowett
Kaiser
Kamaz
Karry
Karsan
Kenworth
Kia
Kleinschnittger
Koenigsegg
Komatsu
KTM
Lada
Lagonda
Lamborghini
Lancia
Land Rover
Landwind
LDV
Lexus
Leyland
Lifan
Ligier
Lincoln
Lister
Lloyd
Lombardi
Lotus
LTI
LuAZ
Lucra
Luxgen
Lynk & Co
Mahindra
MAN
Marcos
Marussia
Maruti
Maserati
Mastretta
Matra
Maxus
Maybach
MAZ
Mazda
McLaren
Mega
Melkus
Mercedes-Benz
Mercury
Merkur
Messerschmitt
Meteor
MG
Microcar
Mikrus
Mini
Mitsubishi
Mitsuoka
Miura
Mochet
Monteverdi
Moretti
Morgan
Morris
Moskvitch
Mosler
Muntz
Nash
Naza
NIO
Nissan
Noble
NSU
O.S.C.A.
Oldsmobile
Opel
Optare
Oshkosh
OSI
Packard
Pagani
Panhard
Panoz
Panther
Peel
Peerless
Pegaso
Perodua
Peterbilt
Peugeot
Piaggio
Pininfarina
Plymouth
Polestar
Polski Fiat
Pontiac
Porsche
Praga
Premier
Prince
Proton
PUCH
Puma
Qoros
Qvale
RAF
RAM
Rambler
Rayton-Fissore
Reliant
Renault
Rene Bonnet
Riich
Riley
Rimac
Roewe
Rolls-Royce
Ronart
Rossion
Rover
RUF
Rumpler
Saab
SAIPA
Saleen
Santa Matilde
Santana
Saturn
Sbarro
Scammell
SCG
Scion
SEAT
Sebring-Vanguard
Senova
Shanghai
Shelby
ShuangHuan
Siata
Simca
Singer
Skoda
Smart
Soueast
Spyker
SsangYong
Standard
Steyr
Studebaker
Stutz
Subaru
Sunbeam
Suzuki
SWM
TagAz
Talbot
Tarpan
Tata
Tatra
Tazzari
Tesla
Tianye
Tofas
Toyota
Trabant
Traum
Triumph
Trumpchi
Tucker
TVR
UAZ
Ultima
UMM
Vanden Plas
Vauxhall
VAZ
Vector
Vencer
Venturi
Venucia
Volkswagen
Volvo
Vortex
VUHL
W Motors
Wanderer
Warszawa
Wartburg
Westfield
Wiesmann
Willys
Wolseley
Xiali
Yamaha
Yema
Zastava
ZAZ
Zender
Zenvo
ZiL
Zimmer
Zotye
ZX`;

const objects = `person
bicycle
car
motorbike
aeroplane
bus
train
truck
boat
traffic light
fire hydrant
stop sign
parking meter
bench
bird
cat
dog
horse
sheep
cow
elephant
bear
zebra
giraffe
backpack
umbrella
handbag
tie
suitcase
frisbee
skis
snowboard
sports ball
kite
baseball bat
baseball glove
skateboard
surfboard
tennis racket
bottle
wine glass
cup
fork
knife
spoon
bowl
banana
apple
sandwich
orange
broccoli
carrot
hot dog
pizza
donut
cake
chair
sofa
pottedplant
bed
diningtable
toilet
tvmonitor
laptop
mouse
remote
keyboard
cell phone
microwave
oven
toaster
sink
refrigerator
book
clock
vase
scissors
teddy bear
hair drier
toothbrush`;

const objectsVn = `người
xe đạp
xe ô tô
xe máy
máy bay
xe buýt
tàu hỏa
xe tảm
con thuyền
đèn giao thông
vòi chữa cháy
biển báo dừng
đồng hồ đậu xe
băng ghế
chim
con mèo
chó
ngựa
con cừu
con bò
con voi
chịu đựng
ngựa rằn
hươu cao cổ
balo
chiêc du
túi xách tay
cà vạt
chiếc vali
chiếc dĩa nhựa ném
ván trượt
ván trượt tuyết
bóng thể thao
diều
gậy bóng chày
găng tay bóng chày
ván trượt
ván lướt sóng
vợt tennis
chai
ly rượu
tách
cái nĩa
dao
cái thìa
bát
chuối
quả táo
bánh mì sandwich
quả cam
bông cải xanh
củ cà rốt
bánh mì kẹp xúc xích
bánh pizza
bánh vòng
bánh
cái ghế
ghế sô pha
cây trồng trong chậu
giường
bàn ăn
phòng vệ sinh
màn hình tivi
máy tính xách tay
chuột
điều khiển tivi
bàn phím
điện thoại di động
lò vi sóng
lò nướng
máy nướng bánh mì
bồn rửa
tủ đá
sách
cái đồng hồ
lọ cắm hoa
cây kéo
gấu bông
máy sấy tóc
bàn chải đánh răng`;

export const CARS = carNames.split('\n');

export const COLORS = {
    Pink: 'Hồng',
    Red: 'Đỏ',
    Orange: 'Cam',
    Brown: 'Nâu',
    Yellow: 'Vàng',
    Green: 'Xanh',
    Cyan: 'Lục lam',
    Blue: 'Xanh dương',
    Purple: 'Tím',
    Gray: 'Xám',
    White: 'Trắng',
    Black: 'Đen',
};

export const OBJECTS = {
    person: 'Người',
    bicycle: 'Xe đạp',
    car: 'Xe ô tô',
    motorbike: 'Xe máy',
    aeroplane: 'Máy bay',
    bus: 'Xe buýt',
    train: 'Tàu hỏa',
    truck: 'Xe tảm',
    boat: 'Con thuyền',
    'traffic light': 'Đèn giao thông',
    'fire hydrant': 'Vòi chữa cháy',
    'stop sign': 'Biển báo dừng',
    'parking meter': 'Đồng hồ đậu xe',
    bench: 'Băng ghế',
    bird: 'Chim',
    cat: 'Con mèo',
    dog: 'Chó',
    horse: 'Ngựa',
    sheep: 'Con cừu',
    cow: 'Con bò',
    elephant: 'Con voi',
    bear: 'Chịu đựng',
    zebra: 'Ngựa rằn',
    giraffe: 'Hươu cao cổ',
    backpack: 'Balo',
    umbrella: 'Chiêc du',
    handbag: 'Túi xách tay',
    tie: 'Cà vạt',
    suitcase: 'Chiếc vali',
    frisbee: 'Chiếc dĩa nhựa ném',
    skis: 'Ván trượt',
    snowboard: 'Ván trượt tuyết',
    'sports ball': 'Bóng thể thao',
    kite: 'Diều',
    'baseball bat': 'Gậy bóng chày',
    'baseball glove': 'Găng tay bóng chày',
    skateboard: 'Ván trượt',
    surfboard: 'Ván lướt sóng',
    'tennis racket': 'Vợt tennis',
    bottle: 'Chai',
    'wine glass': 'Ly rượu',
    cup: 'Tách',
    fork: 'Cái nĩa',
    knife: 'Dao',
    spoon: 'Cái thìa',
    bowl: 'Bát',
    banana: 'Chuối',
    apple: 'Quả táo',
    sandwich: 'Bánh mì sandwich',
    orange: 'Quả cam',
    broccoli: 'Bông cải xanh',
    carrot: 'Củ cà rốt',
    'hot dog': 'Bánh mì kẹp xúc xích',
    pizza: 'Bánh pizza',
    donut: 'Bánh vòng',
    cake: 'Bánh',
    chair: 'Cái ghế',
    sofa: 'Ghế sô pha',
    pottedplant: 'Cây trồng trong chậu',
    bed: 'Giường',
    diningtable: 'Bàn ăn',
    toilet: 'Phòng vệ sinh',
    tvmonitor: 'Màn hình tivi',
    laptop: 'Máy tính xách tay',
    mouse: 'Chuột',
    remote: 'Điều khiển tivi',
    keyboard: 'Bàn phím',
    'cell phone': 'Điện thoại di động',
    microwave: 'Lò vi sóng',
    oven: 'Lò nướng',
    toaster: 'Máy nướng bánh mì',
    sink: 'Bồn rửa',
    refrigerator: 'Tủ đá',
    book: 'Sách',
    clock: 'Cái đồng hồ',
    vase: 'Lọ cắm hoa',
    scissors: 'Cây kéo',
    'teddy bear': 'Gấu bông',
    'hair drier': 'Máy sấy tóc',
    toothbrush: 'Bàn chải đánh răng',
};
