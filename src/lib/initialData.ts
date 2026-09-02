export const INITIAL_COST_ITEMS = [
  { id: 0, name: "비주얼 목업 (Visual Mock-up)", quantity: 1, materialPrice: 15000000, laborPrice: 5000000, expensePrice: 0, subItems: [
    { id: "s0_1", name: "비주얼 목업 설치 자재비", spec: "에어로다이나믹 외장 목업", unit: "식", quantity: 1, materialPrice: 15000000, laborPrice: 0, expensePrice: 0 },
    { id: "s0_2", name: "비주얼 목업 설치 인건비", spec: "특급/고급 기공", unit: "식", quantity: 1, materialPrice: 0, laborPrice: 5000000, expensePrice: 0 }
  ]},
  { id: 1, name: "비정형/파라펫 구간 구조틀공사", quantity: 830, materialPrice: 535000, laborPrice: 238500, expensePrice: 129130, subItems: [
    { id: "s1_1", name: "SPACE FRAME", spec: "비정형구간 MAIN", unit: "식", quantity: 1, materialPrice: 348000, laborPrice: 145000, expensePrice: 57500 },
    { id: "s1_2", name: "S/F member", spec: "STK400 일반구조용 탄소강관", unit: "개소", quantity: 4, materialPrice: 25000, laborPrice: 15000, expensePrice: 5000 },
    { id: "s1_3", name: "T-형강 및 기타 부자재", spec: "T-100x100x8/12T 밴딩포함", unit: "식", quantity: 1, materialPrice: 87000, laborPrice: 33500, expensePrice: 51630 }
  ]},
  { id: 2, name: "NOSING구간 구조틀 공사", quantity: 350, materialPrice: 209590, laborPrice: 145600, expensePrice: 55140, subItems: [
    { id: "s2_1", name: "T-형강(비정형)", spec: "밴딩포함", unit: "m2", quantity: 1, materialPrice: 105000, laborPrice: 65000, expensePrice: 25000 },
    { id: "s2_2", name: "ㅁ-PIPE(곡면)외", spec: "부자재 일체", unit: "식", quantity: 1, materialPrice: 104590, laborPrice: 80600, expensePrice: 30140 }
  ]},
  { id: 3, name: "3D패널 공사", quantity: 370, materialPrice: 814590, laborPrice: 96000, expensePrice: 58030, subItems: [
    { id: "s3_1", name: "3T AL. SHEET 성형패널", spec: "3D 성형가공외", unit: "m2", quantity: 1, materialPrice: 400000, laborPrice: 50000, expensePrice: 20000 },
    { id: "s3_2", name: "AL. Stiffener 가공", spec: "H:60 브라켓 포함", unit: "식", quantity: 1, materialPrice: 300000, laborPrice: 30000, expensePrice: 20000 },
    { id: "s3_3", name: "1.8T TPO / 차수판 및 부자재", spec: "단열 및 부자재", unit: "식", quantity: 1, materialPrice: 114590, laborPrice: 16000, expensePrice: 18030 }
  ]},
  { id: 4, name: "NOSING PANEL", quantity: 350, materialPrice: 1005000, laborPrice: 200500, expensePrice: 94570, subItems: [
    { id: "s4_1", name: "3T AL. SHEET 노징", spec: "곡면 가공", unit: "m2", quantity: 1, materialPrice: 500000, laborPrice: 100000, expensePrice: 40000 },
    { id: "s4_2", name: "AL. Stiffener 및 보강재", spec: "보강철물", unit: "식", quantity: 1, materialPrice: 300000, laborPrice: 50000, expensePrice: 30000 },
    { id: "s4_3", name: "TPO 및 2T 차수판", spec: "방수/차수재", unit: "식", quantity: 1, materialPrice: 205000, laborPrice: 50500, expensePrice: 24570 }
  ]},
  { id: 5, name: "파라펫 두겁판넬공사", quantity: 200, materialPrice: 804250, laborPrice: 130850, expensePrice: 58710, subItems: [
    { id: "s5_1", name: "두겁판넬 3T AL. SHEET", spec: "절곡 및 도장", unit: "m2", quantity: 1, materialPrice: 450000, laborPrice: 70000, expensePrice: 30000 },
    { id: "s5_2", name: "Stiffener 및 부자재", spec: "부속자재 일체", unit: "식", quantity: 1, materialPrice: 354250, laborPrice: 60850, expensePrice: 28710 }
  ]},
  { id: 6, name: "파라펫 내측벽체판넬 공사", quantity: 280, materialPrice: 306390, laborPrice: 65410, expensePrice: 46470, subItems: [
    { id: "s6_1", name: "내측 벽체판넬 자재", spec: "3T AL. SHEET", unit: "m2", quantity: 1, materialPrice: 200000, laborPrice: 40000, expensePrice: 20000 },
    { id: "s6_2", name: "방수재 및 부자재", spec: "1.8T TPO 외", unit: "식", quantity: 1, materialPrice: 106390, laborPrice: 25410, expensePrice: 26470 }
  ]},
  { id: 7, name: "SOFFIT FASICA PANEL", quantity: 120, materialPrice: 412100, laborPrice: 113300, expensePrice: 58700, subItems: [
    { id: "s7_1", name: "SOFFIT 외단부 판넬", spec: "스팬드럴 하단", unit: "m", quantity: 1, materialPrice: 250000, laborPrice: 60000, expensePrice: 30000 },
    { id: "s7_2", name: "고정 철물 및 부자재", spec: "브라켓 및 앵커", unit: "식", quantity: 1, materialPrice: 162100, laborPrice: 53300, expensePrice: 28700 }
  ]},
  { id: 8, name: "SOFFIT PANEL", quantity: 135, materialPrice: 326490, laborPrice: 167020, expensePrice: 58550, subItems: [
    { id: "s8_1", name: "SOFFIT 3T AL. SHEET", spec: "도장 포함", unit: "m2", quantity: 1, materialPrice: 200000, laborPrice: 90000, expensePrice: 30000 },
    { id: "s8_2", name: "하지철물", spec: "설치 및 고정", unit: "식", quantity: 1, materialPrice: 126490, laborPrice: 77020, expensePrice: 28550 }
  ]},
  { id: 9, name: "채광창 내부 곡면판넬공사", quantity: 213, materialPrice: 259220, laborPrice: 101660, expensePrice: 58700, subItems: [
    { id: "s9_1", name: "곡면판넬 3T AL.", spec: "R-가공", unit: "m2", quantity: 1, materialPrice: 150000, laborPrice: 50000, expensePrice: 30000 },
    { id: "s9_2", name: "단열재 및 하지철물", spec: "단열/고정 일체", unit: "식", quantity: 1, materialPrice: 109220, laborPrice: 51660, expensePrice: 28700 }
  ]},
  { id: 10, name: "단열공사", quantity: 250, materialPrice: 66300, laborPrice: 39500, expensePrice: 27660, subItems: [
    { id: "s10_1", name: "단열재 (NOSING, 3D구간)", spec: "방염/불연", unit: "m2", quantity: 1, materialPrice: 50000, laborPrice: 25000, expensePrice: 15000 },
    { id: "s10_2", name: "테이프 및 부착 부자재", spec: "접착/기밀재", unit: "식", quantity: 1, materialPrice: 16300, laborPrice: 14500, expensePrice: 12660 }
  ]},
  { id: 11, name: "AL 복합패널(비선형)_천장", quantity: 610, materialPrice: 681000, laborPrice: 296000, expensePrice: 120710, subItems: [
    { id: "s11_1", name: "방사형 AL 복합패널", spec: "H=200~1400", unit: "m2", quantity: 1, materialPrice: 400000, laborPrice: 150000, expensePrice: 60000 },
    { id: "s11_2", name: "불소도장 및 EXPANDED METAL", spec: "지정색 마감", unit: "식", quantity: 1, materialPrice: 281000, laborPrice: 146000, expensePrice: 60710 }
  ]},
  { id: 12, name: "AL 복합패널(비선형)_수벽", quantity: 150, materialPrice: 616230, laborPrice: 268000, expensePrice: 109700, subItems: [
    { id: "s12_1", name: "경사형 AL 복합패널", spec: "H=200", unit: "m2", quantity: 1, materialPrice: 350000, laborPrice: 140000, expensePrice: 50000 },
    { id: "s12_2", name: "수벽 부속자재 및 마감", spec: "지정색 불소도장", unit: "식", quantity: 1, materialPrice: 266230, laborPrice: 128000, expensePrice: 59700 }
  ]}
];
