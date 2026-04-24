// ============= ДАННЫЕ =============

const PRODUCTS = [
    { id: 1, name: 'Predator X1', cat: 'gaming', catName: 'Игровой', price: 117000, tag: 'hot', tagName: 'Хит', bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', glow: 'rgba(255,87,34,0.5)', specs: ['AMD Ryzen 5 8400f', 'RTX 5070 12GB', '16 GB DDR5 6000', '500GB NVMe Gen4'], desc: 'Сбалансированная игровая сборка для 1440p в максимальных настройках. Хороший задел на будущее.' },
   ];

const CATEGORIES = [
    { id: 'all', name: 'Все' },
    { id: 'gaming', name: 'Игровые' },
    { id: 'work', name: 'Рабочие' },
    { id: 'enthusiast', name: 'Энтузиаст' },
    { id: 'office', name: 'Офисные' }
];

const CONFIG_STEPS = [
    {
        id: 'case', title: 'Корпус', icon: '▭',
        desc: 'С чего начинается сборка. Выберите дом для вашего ПК — от компактного до премиума.',
        options: [
            { id: 'case_lancool', name: 'Lian Li Lancool 216', desc: 'Mid-Tower · 2×160 мм вентилятора', price: 9900, supportsEATX: false, maxGpuLen: 390 },
            { id: 'case_h7', name: 'NZXT H7 Flow RGB', desc: 'Mid-Tower · RGB · сетчатая панель', price: 14500, supportsEATX: false, maxGpuLen: 400 },
            { id: 'case_torrent', name: 'Fractal Design Torrent', desc: 'Full-Tower · максимальная продуваемость', price: 19900, supportsEATX: true, maxGpuLen: 461 },
            { id: 'case_o11', name: 'Lian Li O11 Dynamic EVO', desc: 'Mid-Tower · двухкамерный · витрина', price: 18900, supportsEATX: true, maxGpuLen: 420 }
        ]
    },
    {
        id: 'platform', title: 'Платформа', icon: '◈',
        desc: 'Определяет сокет, тип памяти и чипсет. От этого зависит выбор процессора и материнской платы.',
        options: [
            { id: 'amd_am5', name: 'AMD AM5', desc: 'Ryzen 7000/9000 · DDR5 · PCIe 5.0', price: 0, platform: 'amd_am5' },
            { id: 'intel_lga', name: 'Intel LGA 1700', desc: 'Core 13/14-го поколения · DDR5 · проверено временем', price: 0, platform: 'intel_lga' }
        ]
    },
    {
        id: 'cpu', title: 'Процессор', icon: '⚡',
        desc: 'Сердце системы. Устанавливается на материнскую плату — от него зависит скорость всего.',
        options: [
            { id: 'cpu_7600', name: 'AMD Ryzen 5 7600', desc: '6 ядер · 12 потоков · до 5.1 ГГц', price: 19500, tdp: 65, platform: 'amd_am5' },
            { id: 'cpu_7700', name: 'AMD Ryzen 7 7700', desc: '8 ядер · 16 потоков · до 5.3 ГГц', price: 23500, tdp: 65, platform: 'amd_am5' },
            { id: 'cpu_7700x', name: 'AMD Ryzen 7 7700X', desc: '8 ядер · 16 потоков · до 5.4 ГГц', price: 28500, tdp: 105, platform: 'amd_am5' },
            { id: 'cpu_7800x3d', name: 'AMD Ryzen 7 7800X3D', desc: '8 ядер · 3D V-Cache · до 5.0 ГГц', price: 32900, tdp: 120, platform: 'amd_am5', badge: 'Топ для игр' },
            { id: 'cpu_9700x', name: 'AMD Ryzen 7 9700X', desc: '8 ядер · Zen 5 · до 5.5 ГГц', price: 31500, tdp: 65, platform: 'amd_am5' },
            { id: 'cpu_7900x', name: 'AMD Ryzen 9 7900X', desc: '12 ядер · 24 потока · до 5.6 ГГц', price: 42500, tdp: 170, platform: 'amd_am5' },
            { id: 'cpu_9800x3d', name: 'AMD Ryzen 7 9800X3D', desc: '8 ядер · Zen 5 · 3D V-Cache · до 5.2 ГГц', price: 54900, tdp: 120, platform: 'amd_am5', badge: 'Флагман' },
            { id: 'cpu_7950x', name: 'AMD Ryzen 9 7950X', desc: '16 ядер · 32 потока · до 5.7 ГГц', price: 59900, tdp: 170, platform: 'amd_am5' },
            { id: 'cpu_14400f', name: 'Intel Core i5-14400F', desc: '10 ядер · 16 потоков · до 4.7 ГГц', price: 15900, tdp: 65, platform: 'intel_lga' },
            { id: 'cpu_14600kf', name: 'Intel Core i5-14600KF', desc: '14 ядер · 20 потоков · до 5.3 ГГц', price: 23500, tdp: 125, platform: 'intel_lga' },
            { id: 'cpu_14700kf', name: 'Intel Core i7-14700KF', desc: '20 ядер · 28 потоков · до 5.6 ГГц', price: 35900, tdp: 125, platform: 'intel_lga' },
            { id: 'cpu_14900kf', name: 'Intel Core i9-14900KF', desc: '24 ядра · 32 потока · до 6.0 ГГц', price: 52900, tdp: 125, platform: 'intel_lga' }
        ]
    },
    {
        id: 'mb', title: 'Материнская плата', icon: '▦',
        desc: 'Устанавливается в корпус. Связывает все комплектующие — чипсет должен подходить под процессор.',
        options: [
            { id: 'mb_a620m', name: 'ASRock A620M Pro', desc: 'AM5 · micro-ATX · DDR5 · базовый для Ryzen', price: 8500, platform: 'amd_am5', formFactor: 'mATX' },
            { id: 'mb_b650m', name: 'MSI PRO B650M-A WiFi', desc: 'AM5 · micro-ATX · DDR5 · WiFi 6E', price: 12500, platform: 'amd_am5', formFactor: 'mATX' },
            { id: 'mb_b650', name: 'Gigabyte B650 Aorus Elite AX', desc: 'AM5 · ATX · DDR5 · PCIe 5.0 M.2 · надёжный средний', price: 17500, platform: 'amd_am5', formFactor: 'ATX' },
            { id: 'mb_b650e', name: 'ASUS TUF Gaming B650E-Plus', desc: 'AM5 · ATX · DDR5 · PCIe 5.0 x16 · USB4', price: 20500, platform: 'amd_am5', formFactor: 'ATX' },
            { id: 'mb_x670e', name: 'ASUS ROG Strix X670E-F', desc: 'AM5 · ATX · DDR5 · PCIe 5.0 · топ для разгона', price: 36500, platform: 'amd_am5', formFactor: 'ATX', badge: 'Топ' },
            { id: 'mb_x870e', name: 'MSI MPG X870E Carbon WiFi', desc: 'AM5 · ATX · DDR5 · PCIe 5.0 · USB4 · новинка', price: 43500, platform: 'amd_am5', formFactor: 'ATX', badge: 'Новинка' },
            { id: 'mb_b760m', name: 'MSI PRO B760M-A DDR5', desc: 'LGA 1700 · micro-ATX · базовый вариант', price: 11500, platform: 'intel_lga', formFactor: 'mATX' },
            { id: 'mb_b760', name: 'Gigabyte B760 Gaming X AX', desc: 'LGA 1700 · ATX · DDR5 · WiFi 6E · средний', price: 15500, platform: 'intel_lga', formFactor: 'ATX' },
            { id: 'mb_z790a', name: 'ASUS TUF Gaming Z790-Plus WiFi', desc: 'LGA 1700 · ATX · DDR5 · разгон CPU/RAM', price: 25500, platform: 'intel_lga', formFactor: 'ATX' },
            { id: 'mb_z790', name: 'MSI MPG Z790 Carbon WiFi', desc: 'LGA 1700 · ATX · DDR5 · PCIe 5.0 · флагман', price: 35500, platform: 'intel_lga', formFactor: 'ATX', badge: 'Топ' },
            { id: 'mb_z790e', name: 'ASUS ROG Maximus Z790 Extreme', desc: 'LGA 1700 · E-ATX · DDR5 · экстремальный разгон', price: 59000, platform: 'intel_lga', formFactor: 'EATX', badge: 'Экстрим' }
        ]
    },
    {
        id: 'cooler', title: 'Охлаждение CPU', icon: '❄',
        desc: 'Устанавливается поверх процессора. Башенный — тихо, AIO — мощнее для горячих процессоров.',
        options: [
            { id: 'cool_ak620', name: 'DeepCool AK620', desc: 'Башенный 2×120 мм · топ по тишине', price: 5500, maxTdp: 180 },
            { id: 'cool_240aio', name: 'Arctic Liquid Freezer III 240', desc: 'AIO 240 мм · баланс цены и охлаждения', price: 9900, maxTdp: 250 },
            { id: 'cool_360rgb', name: 'Lian Li Galahad II 360 RGB', desc: 'AIO 360 мм · RGB · для топовых процессоров', price: 15900, maxTdp: 320 }
        ]
    },
    {
        id: 'ram', title: 'Оперативная память', icon: '▤',
        desc: 'Вставляется в слоты материнской платы. DDR5 — стандарт для новых платформ.',
        options: [
            { id: 'ram_16', name: '16 GB DDR5 6000 CL30', desc: '2×8 · базовая для AM5/LGA 1700', price: 6900 },
            { id: 'ram_32', name: '32 GB DDR5 6000 CL30', desc: '2×16 · оптимум для игр и работы', price: 12500 },
            { id: 'ram_32_fast', name: '32 GB DDR5 6400 CL32 RGB', desc: '2×16 · быстрая, с подсветкой', price: 15900 },
            { id: 'ram_64', name: '64 GB DDR5 6000 CL30', desc: '2×32 · для рендера, монтажа, AI', price: 27900 },
            { id: 'ram_128', name: '128 GB DDR5 5600', desc: '4×32 · для рабочих станций', price: 58900 }
        ]
    },
    {
        id: 'gpu', title: 'Видеокарта', icon: '▰',
        desc: 'Устанавливается в PCIe-слот. Главное для игр — от неё зависит FPS и разрешение.',
        options: [
            { id: 'gpu_4060', name: 'RTX 4060 8GB', desc: '1080p ultra · базовая игровая', price: 35900, power: 115, gpuLen: 230 },
            { id: 'gpu_4060ti', name: 'RTX 4060 Ti 16GB', desc: '1440p · 16 ГБ для AI и рабочих задач', price: 49900, power: 165, gpuLen: 267 },
            { id: 'gpu_5070', name: 'RTX 5070 12GB', desc: '1440p ultra · DLSS 4 · GDDR7', price: 71900, power: 250, gpuLen: 304, badge: 'Новое' },
            { id: 'gpu_4070s', name: 'RTX 4070 SUPER 12GB', desc: '1440p ultra · проверенный выбор', price: 74900, power: 220, gpuLen: 304 },
            { id: 'gpu_5070ti', name: 'RTX 5070 Ti 16GB', desc: '1440p/4K · флагман среднего сегмента', price: 105900, power: 300, gpuLen: 335, badge: 'Топ' },
            { id: 'gpu_4080s', name: 'RTX 4080 SUPER 16GB', desc: '4K с DLSS · для творчества и RT', price: 134900, power: 320, gpuLen: 340 },
            { id: 'gpu_5080', name: 'RTX 5080 16GB', desc: '4K · Blackwell · DLSS 4', price: 159900, power: 360, gpuLen: 355 },
            { id: 'gpu_5090', name: 'RTX 5090 32GB', desc: '4K native · 8K · без компромиссов', price: 319900, power: 575, gpuLen: 405, badge: 'Ультра' }
        ]
    },
    {
        id: 'ssd', title: 'Накопитель', icon: '▱',
        desc: 'M.2 NVMe — вставляется прямо в материнскую плату. Быстрая загрузка системы и игр.',
        options: [
            { id: 'ssd_500', name: '500 GB NVMe Gen4', desc: 'Kingston NV2 · несколько игр + система', price: 4900 },
            { id: 'ssd_1tb', name: '1 TB NVMe Gen4', desc: 'Samsung 980 Pro · оптимум на старте', price: 8900 },
            { id: 'ssd_2tb', name: '2 TB NVMe Gen4', desc: 'Samsung 990 Pro · с запасом', price: 17900 },
            { id: 'ssd_4tb', name: '4 TB NVMe Gen4', desc: 'WD Black SN850X · для видеомонтажа', price: 42900 }
        ]
    },
    {
        id: 'psu', title: 'Блок питания', icon: '◉',
        desc: 'Устанавливается последним. Питает всю систему — мощности должно хватать с запасом.',
        options: [
            { id: 'psu_650', name: '650W Gold (Corsair RM650e)', desc: 'Для средних сборок до RTX 4070', price: 8900, watts: 650 },
            { id: 'psu_850', name: '850W Gold (Corsair RM850e)', desc: 'Универсальный для большинства', price: 12500, watts: 850 },
            { id: 'psu_1000', name: '1000W Gold (be quiet! Straight Power)', desc: 'Для топовых GPU и разогнанных CPU', price: 18900, watts: 1000 },
            { id: 'psu_1200', name: '1200W Platinum (Seasonic Prime)', desc: 'Для RTX 5090 и Threadripper', price: 27900, watts: 1200 }
        ]
    }
];

const ASSEMBLY_FEE = 4900;

const CHECKPOINTS = [
    { id: 'stress_test', name: 'Стресс-тест 48 ч', desc: 'AIDA64, FurMark, Prime95 — гарантируем стабильность', price: 0, defaultOn: true },
    { id: 'windows', name: 'Установка Windows 11', desc: 'Без лицензии — все драйверы и обновления установлены', price: 0, defaultOn: false },
    { id: 'crating', name: 'Обрешётка для доставки', desc: 'Деревянный каркас — защита при перевозке через пол-России', price: 0, defaultOn: true }
];
