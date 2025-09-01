import { PrismaClient, Prisma } from "@prisma/client";

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

// 挿入する家賃補助対象の住所データ（新しい形式）
const specifiedAddresses = [
  // 渋谷区
  {
    city: "渋谷区",
    towns: [
      "宇田川町",
      "円山町",
      "猿楽町",
      "桜丘町",
      "神山町",
      "神泉町",
      "代官山町",
      "南平台町",
      "鉢山町",
      "鶯谷町",
    ],
  },
  { city: "渋谷区", towns: ["恵比寿"], chomes: [1, 2, 3, 4] },
  { city: "渋谷区", towns: ["恵比寿西"], chomes: [1, 2] },
  { city: "渋谷区", towns: ["恵比寿南"], chomes: [1, 2, 3, 4] },
  { city: "渋谷区", towns: ["広尾"], chomes: [1, 2, 3, 4, 5] },
  { city: "渋谷区", towns: ["渋谷"], chomes: [1, 2, 3, 4] },
  { city: "渋谷区", towns: ["松濤"], chomes: [1, 2] },
  { city: "渋谷区", towns: ["上原"], chomes: [1, 2] },
  { city: "渋谷区", towns: ["神宮前"], chomes: [1, 2, 3, 4, 5, 6] },
  { city: "渋谷区", towns: ["神南"], chomes: [1, 2] },
  { city: "渋谷区", towns: ["千駄ヶ谷"], chomes: [1, 2, 3, 4, 5] },
  { city: "渋谷区", towns: ["代々木"], chomes: [1, 5] },
  { city: "渋谷区", towns: ["東"], chomes: [1, 2, 3, 4] },
  { city: "渋谷区", towns: ["道玄坂"], chomes: [1, 2] },
  { city: "渋谷区", towns: ["富ヶ谷"], chomes: [1, 2] },
  // 目黒区
  { city: "目黒区", towns: ["駒場"], chomes: [1, 2, 3, 4] },
  { city: "目黒区", towns: ["目黒"], chomes: [1, 2, 3] },
  { city: "目黒区", towns: ["上目黒"], chomes: [1, 2, 3, 4, 5] },
  { city: "目黒区", towns: ["下目黒"], chomes: [1, 2, 3, 4] },
  { city: "目黒区", towns: ["青葉台"], chomes: [1, 2, 3, 4] },
  { city: "目黒区", towns: ["大橋"], chomes: [1, 2] },
  { city: "目黒区", towns: ["中目黒"], chomes: [1, 2, 3, 4, 5] },
  { city: "目黒区", towns: ["東山"], chomes: [1, 2, 3] },
  { city: "目黒区", towns: ["祐天寺"], chomes: [1] },
  { city: "目黒区", towns: ["三田"], chomes: [1, 2] },
  // 世田谷区
  { city: "世田谷区", towns: ["上馬"], chomes: [1, 2] },
  { city: "世田谷区", towns: ["下馬"], chomes: [1, 2, 3] },
  { city: "世田谷区", towns: ["三軒茶屋"], chomes: [1, 2] },
  { city: "世田谷区", towns: ["三宿"], chomes: [1, 2] },
  { city: "世田谷区", towns: ["若林"], chomes: [1] },
  { city: "世田谷区", towns: ["太子堂"], chomes: [1, 2, 3, 4, 5] },
  { city: "世田谷区", towns: ["代沢"], chomes: [1] },
  { city: "世田谷区", towns: ["池尻"], chomes: [1, 2, 3, 4] },
  // 港区
  { city: "港区", towns: ["元麻布"], chomes: [2] },
  { city: "港区", towns: ["西麻布"], chomes: [1, 2, 3, 4, 5] },
  { city: "港区", towns: ["赤坂"], chomes: [6, 7, 8, 9] },
  { city: "港区", towns: ["南青山"], chomes: [1, 2, 3, 4, 5, 6, 7] },
  { city: "港区", towns: ["南麻布"], chomes: [3, 4] },
  { city: "港区", towns: ["白金台"], chomes: [3] },
  { city: "港区", towns: ["北青山"], chomes: [1, 2, 3] },
  { city: "港区", towns: ["六本木"], chomes: [7] },
  // 品川区
  { city: "品川区", towns: ["上大崎"], chomes: [1, 2, 3, 4] },
  { city: "品川区", towns: ["西五反田"], chomes: [3] },
  { city: "品川区", towns: ["東五反田"], chomes: [5] },
];

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. マスタデータの作成 ---
  await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "USER" },
  });
  await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: "ADMIN" },
  });

  const typeMansion = await prisma.propertyType.create({
    data: { name: "マンション" },
  });
  const typeHouse = await prisma.propertyType.create({
    data: { name: "戸建て" },
  });
  const typeApartment = await prisma.propertyType.create({
    data: { name: "アパート" },
  });

  const layout1LDK = await prisma.layout.create({ data: { name: "1LDK" } });
  const layout2LDK = await prisma.layout.create({ data: { name: "2LDK" } });
  const layout1K = await prisma.layout.create({ data: { name: "1K" } });
  const layout1R = await prisma.layout.create({ data: { name: "1R" } });
  const layout1DK = await prisma.layout.create({ data: { name: "1DK" } });
  const layout2K = await prisma.layout.create({ data: { name: "2K" } });
  const layout2DK = await prisma.layout.create({ data: { name: "2DK" } });
  const layout3LDK = await prisma.layout.create({ data: { name: "3LDK" } });

  const featurePet = await prisma.feature.create({
    data: { name: "ペット可" },
  });
  const featureBalcony = await prisma.feature.create({
    data: { name: "バルコニー" },
  });
  const featureAutoLock = await prisma.feature.create({
    data: { name: "オートロック" },
  });
  const featureSeparateBathToilet = await prisma.feature.create({
    data: { name: "風呂トイレ別" },
  });
  const featureDeliveryBox = await prisma.feature.create({
    data: { name: "宅配ボックス" },
  });
  const featureFreeInternet = await prisma.feature.create({
    data: { name: "インターネット無料" },
  });

  const workplaceShibuya = await prisma.workplace.create({
    data: { id: 1, name: "渋谷拠点・半蔵門支店" },
  });

  console.log("Master data created.");

  // --- 2. 家賃補助対象住所の作成 ---
  const rentAllowanceAddresses: Prisma.RentAllowanceAddressCreateManyInput[] =
    [];
  const prefecture = "東京都";

  for (const group of specifiedAddresses) {
    if (group.chomes) {
      // { city, towns, chomes } 形式の処理
      for (const town of group.towns) {
        for (const chome of group.chomes) {
          rentAllowanceAddresses.push({
            prefecture,
            city: group.city,
            town,
            chome,
            workplaceId: workplaceShibuya.id,
          });
        }
      }
    } else {
      // { city, towns } 形式の処理 (丁目が指定されていない町名)
      for (const town of group.towns) {
        // 1丁目から5丁目までを自動で補完
        for (let i = 1; i <= 5; i++) {
          rentAllowanceAddresses.push({
            prefecture,
            city: group.city,
            town: town,
            chome: i,
            workplaceId: workplaceShibuya.id,
          });
        }
      }
    }
  }

  await prisma.rentAllowanceAddress.createMany({
    data: rentAllowanceAddresses,
    skipDuplicates: true,
  });
  console.log(
    `${rentAllowanceAddresses.length} rent allowance addresses created.`
  );

  // --- 3. 仮物件の作成 ---
  const fixedFloorPlanUrl = "/images/floorplans/placeholder.jpg";
  await prisma.property.createMany({
    data: [
      {
        name: "パークアクシス渋谷神南",
        priceRent: 50000,
        zip: "150-0041",
        prefecture: "東京都",
        city: "渋谷区",
        town: "神南",
        chome: 1,
        block: 20,
        building: "パークアクシス渋谷神南",
        nearestStation: "渋谷駅",
        walkToStation: 8,
        areaSqm: 45.5,
        buildDate: new Date("2025-04-01"),
        floor: 12,
        totalFloors: 15,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "1201",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout1R.id,
      },
      {
        name: "代官山アドレス ザ・タワー",
        priceRent: 45000,
        zip: "150-0034",
        prefecture: "東京都",
        city: "渋谷区",
        town: "代官山町",
        chome: 17,
        block: 1,
        building: "ザ・タワー",
        nearestStation: "代官山駅",
        walkToStation: 1,
        areaSqm: 80.2,
        buildDate: new Date("2022-08-01"),
        floor: 25,
        totalFloors: 36,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "2505",
        isEmpty: false,
        propertyTypeId: typeMansion.id,
        layoutId: layout2LDK.id,
      },
      {
        name: "中目黒アトラスタワー",
        priceRent: 80000,
        zip: "153-0051",
        prefecture: "東京都",
        city: "目黒区",
        town: "上目黒",
        chome: 1,
        block: 26,
        building: "アトラスタワー",
        nearestStation: "中目黒駅",
        walkToStation: 2,
        areaSqm: 65.0,
        buildDate: new Date("2021-10-01"),
        floor: 30,
        totalFloors: 45,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "3001",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout2LDK.id,
      },
      {
        name: "世田谷公園近くのアパート",
        priceRent: 120000,
        zip: "154-0001",
        prefecture: "東京都",
        city: "世田谷区",
        town: "池尻",
        chome: 1,
        block: 5,
        building: "グリーンハイツ",
        nearestStation: "三軒茶屋駅",
        walkToStation: 12,
        areaSqm: 25.0,
        buildDate: new Date("2024-02-01"),
        floor: 1,
        totalFloors: 2,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "101",
        isEmpty: true,
        propertyTypeId: typeApartment.id,
        layoutId: layout1K.id,
      },
      {
        name: "松濤の戸建て",
        priceRent: 80000,
        zip: "150-0046",
        prefecture: "東京都",
        city: "渋谷区",
        town: "松濤",
        chome: 1,
        block: 2,
        building: null,
        nearestStation: "神泉駅",
        walkToStation: 7,
        areaSqm: 150.0,
        buildDate: new Date("2023-09-01"),
        floor: 1,
        totalFloors: 2,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: null,
        isEmpty: true,
        propertyTypeId: typeHouse.id,
        layoutId: layout2LDK.id,
      },
      {
        name: "広尾ガーデンヒルズ",
        priceRent: 600000,
        zip: "150-0012",
        prefecture: "東京都",
        city: "渋谷区",
        town: "広尾",
        chome: 4,
        block: 1,
        building: "広尾ガーデンヒルズ H棟",
        nearestStation: "広尾駅",
        walkToStation: 6,
        areaSqm: 120.5,
        buildDate: new Date("2019-05-20"),
        floor: 3,
        totalFloors: 10,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "H-302",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout3LDK.id,
      },
      {
        name: "ザ・パークハウス 西麻布レジデンス",
        priceRent: 55000,
        zip: "106-0031",
        prefecture: "東京都",
        city: "港区",
        town: "西麻布",
        chome: 4,
        block: 3,
        building: "ザ・パークハウス西麻布",
        nearestStation: "六本木駅",
        walkToStation: 9,
        areaSqm: 95.0,
        buildDate: new Date("2024-11-15"),
        floor: 18,
        totalFloors: 24,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "1804",
        isEmpty: false,
        propertyTypeId: typeMansion.id,
        layoutId: layout2LDK.id,
      },
      {
        name: "ブリリアタワー上野池之端",
        priceRent: 92000,
        zip: "110-0008",
        prefecture: "東京都",
        city: "台東区",
        town: "池之端",
        chome: 1,
        block: 2,
        building: "ブリリアタワー",
        nearestStation: "根津駅",
        walkToStation: 4,
        areaSqm: 55.8,
        buildDate: new Date("2023-01-30"),
        floor: 22,
        totalFloors: 36,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "2201",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout1LDK.id,
      },
      {
        name: "パークコート赤坂檜町ザ タワー",
        priceRent: 980000,
        zip: "107-0052",
        prefecture: "東京都",
        city: "港区",
        town: "赤坂",
        chome: 9,
        block: 7,
        building: "パークコート赤坂檜町",
        nearestStation: "乃木坂駅",
        walkToStation: 3,
        areaSqm: 135.0,
        buildDate: new Date("2022-06-01"),
        floor: 40,
        totalFloors: 44,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "4001",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout3LDK.id,
      },
      {
        name: "シティタワー品川パークフロント",
        priceRent: 280000,
        zip: "141-0022",
        prefecture: "東京都",
        city: "品川区",
        town: "東五反田",
        chome: 5,
        block: 2,
        building: "シティタワー品川",
        nearestStation: "五反田駅",
        walkToStation: 5,
        areaSqm: 58.0,
        buildDate: new Date("2024-03-10"),
        floor: 15,
        totalFloors: 25,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "1502",
        isEmpty: false,
        propertyTypeId: typeMansion.id,
        layoutId: layout1LDK.id,
      },
      {
        name: "三軒茶屋のデザイナーズアパート",
        priceRent: 135000,
        zip: "154-0024",
        prefecture: "東京都",
        city: "世田谷区",
        town: "三軒茶屋",
        chome: 2,
        block: 15,
        building: "S-FLAT",
        nearestStation: "三軒茶屋駅",
        walkToStation: 6,
        areaSqm: 28.5,
        buildDate: new Date("2023-07-20"),
        floor: 2,
        totalFloors: 3,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "203",
        isEmpty: true,
        propertyTypeId: typeApartment.id,
        layoutId: layout1K.id,
      },
      {
        name: "恵比寿の静かな低層マンション",
        priceRent: 290000,
        zip: "150-0013",
        prefecture: "東京都",
        city: "渋谷区",
        town: "恵比寿",
        chome: 3,
        block: 8,
        building: "エビスガーデンテラス",
        nearestStation: "恵比寿駅",
        walkToStation: 9,
        areaSqm: 52.0,
        buildDate: new Date("2022-02-18"),
        floor: 2,
        totalFloors: 5,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "201",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout1LDK.id,
      },
      {
        name: "祐天寺のリノベーション物件",
        priceRent: 148000,
        zip: "153-0052",
        prefecture: "東京都",
        city: "目黒区",
        town: "祐天寺",
        chome: 1,
        block: 22,
        building: "リノテラス祐天寺",
        nearestStation: "祐天寺駅",
        walkToStation: 5,
        areaSqm: 35.0,
        buildDate: new Date("2015-08-01"),
        floor: 3,
        totalFloors: 4,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "302",
        isEmpty: true,
        propertyTypeId: typeApartment.id,
        layoutId: layout1DK.id,
      },
      {
        name: "北青山アドレス",
        priceRent: 420000,
        zip: "107-0061",
        prefecture: "東京都",
        city: "港区",
        town: "北青山",
        chome: 1,
        block: 2,
        building: "北青山スクエア",
        nearestStation: "青山一丁目駅",
        walkToStation: 2,
        areaSqm: 70.0,
        buildDate: new Date("2023-10-05"),
        floor: 7,
        totalFloors: 14,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "707",
        isEmpty: false,
        propertyTypeId: typeMansion.id,
        layoutId: layout2K.id,
      },
      {
        name: "コンフォリア新宿イーストサイドタワー",
        priceRent: 350000,
        zip: "160-0022",
        prefecture: "東京都",
        city: "新宿区",
        town: "新宿",
        chome: 6,
        block: 27,
        building: "コンフォリア新宿",
        nearestStation: "東新宿駅",
        walkToStation: 1,
        areaSqm: 60.5,
        buildDate: new Date("2022-12-01"),
        floor: 28,
        totalFloors: 32,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "2810",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout2LDK.id,
      },
      {
        name: "自由が丘のメゾネット",
        priceRent: 310000,
        zip: "152-0035",
        prefecture: "東京都",
        city: "目黒区",
        town: "自由が丘",
        chome: 1,
        block: 8,
        building: "ヒルサイドメゾン",
        nearestStation: "自由が丘駅",
        walkToStation: 6,
        areaSqm: 75.0,
        buildDate: new Date("2024-01-15"),
        floor: 2,
        totalFloors: 3,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "B",
        isEmpty: true,
        propertyTypeId: typeApartment.id,
        layoutId: layout2DK.id,
      },
      {
        name: "ラ・トゥール代官山",
        priceRent: 150000,
        zip: "150-0032",
        prefecture: "東京都",
        city: "渋谷区",
        town: "鶯谷町",
        chome: 13,
        block: 1,
        building: "ラ・トゥール代官山",
        nearestStation: "渋谷駅",
        walkToStation: 8,
        areaSqm: 220.0,
        buildDate: new Date("2022-10-01"),
        floor: 4,
        totalFloors: 7,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "401",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout3LDK.id,
      },
      {
        name: "パークマンション三田綱町ザ フォレスト",
        priceRent: 85000,
        zip: "108-0073",
        prefecture: "東京都",
        city: "港区",
        town: "三田",
        chome: 2,
        block: 1,
        building: "パークマンション三田綱町",
        nearestStation: "麻布十番駅",
        walkToStation: 9,
        areaSqm: 130.0,
        buildDate: new Date("2023-05-25"),
        floor: 5,
        totalFloors: 12,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "503",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout3LDK.id,
      },
      {
        name: "白金台の戸建て",
        priceRent: 950000,
        zip: "108-0071",
        prefecture: "東京都",
        city: "港区",
        town: "白金台",
        chome: 3,
        block: 5,
        building: null,
        nearestStation: "白金台駅",
        walkToStation: 4,
        areaSqm: 180.0,
        buildDate: new Date("2024-06-01"),
        floor: 1,
        totalFloors: 3,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: null,
        isEmpty: true,
        propertyTypeId: typeHouse.id,
        layoutId: layout3LDK.id,
      },
      {
        name: "高輪ゲートウェイ前の新築",
        priceRent: 260000,
        zip: "108-0074",
        prefecture: "東京都",
        city: "港区",
        town: "高輪",
        chome: 2,
        block: 13,
        building: "ゲートウェイタワーズ",
        nearestStation: "高輪ゲートウェイ駅",
        walkToStation: 2,
        areaSqm: 48.0,
        buildDate: new Date("2025-09-01"),
        floor: 8,
        totalFloors: 20,
        floorPlanUrl: fixedFloorPlanUrl,
        roomNumber: "808",
        isEmpty: true,
        propertyTypeId: typeMansion.id,
        layoutId: layout1LDK.id,
      },
    ],
  });
  console.log("20 properties created.");

  // --- 4. 作成した物件に画像を紐付ける ---
  const createdProperties = await prisma.property.findMany({
    select: { id: true, name: true },
  });
  const imageUrls = [
    "/images/properties/apartment.jpg",
    "/images/properties/building.jpg",
    "/images/properties/single-house.jpg",
  ];

  const propertyImagesData = [];
  for (const property of createdProperties) {
    for (const url of imageUrls) {
      propertyImagesData.push({
        imageUrl: url,
        propertyId: property.id,
      });
    }
  }

  await prisma.propertyImage.createMany({
    data: propertyImagesData,
  });
  console.log(`${propertyImagesData.length} property images created.`);

  // --- 5. 作成した物件に設備を紐付ける ---
  for (const property of createdProperties) {
    let featuresToConnect: Prisma.FeatureWhereUniqueInput[] = [];

    if (property.name.includes("パークアクシス"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureSeparateBathToilet.id },
      ];
    if (property.name.includes("アドレス"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureBalcony.id },
        { id: featureDeliveryBox.id },
      ];
    if (property.name.includes("アトラス"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureBalcony.id },
        { id: featureDeliveryBox.id },
        { id: featureFreeInternet.id },
      ];
    if (property.name.includes("アパート"))
      featuresToConnect = [
        { id: featureSeparateBathToilet.id },
        { id: featureBalcony.id },
      ];
    if (property.name.includes("松濤の戸建て"))
      featuresToConnect = [{ id: featurePet.id }, { id: featureBalcony.id }];
    if (property.name.includes("ガーデンヒルズ"))
      featuresToConnect = [
        { id: featurePet.id },
        { id: featureBalcony.id },
        { id: featureAutoLock.id },
      ];
    if (property.name.includes("パークハウス"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureDeliveryBox.id },
        { id: featureBalcony.id },
      ];
    if (property.name.includes("ブリリア"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureDeliveryBox.id },
        { id: featureFreeInternet.id },
      ];
    if (property.name.includes("パークコート"))
      featuresToConnect = [
        { id: featurePet.id },
        { id: featureBalcony.id },
        { id: featureAutoLock.id },
        { id: featureDeliveryBox.id },
        { id: featureFreeInternet.id },
      ];
    if (property.name.includes("シティタワー"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureDeliveryBox.id },
      ];
    if (property.name.includes("デザイナーズ"))
      featuresToConnect = [
        { id: featureBalcony.id },
        { id: featureSeparateBathToilet.id },
        { id: featureFreeInternet.id },
      ];
    if (property.name.includes("恵比寿の静かな"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureSeparateBathToilet.id },
      ];
    if (property.name.includes("祐天寺"))
      featuresToConnect = [{ id: featureBalcony.id }];
    if (property.name.includes("北青山"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureDeliveryBox.id },
      ];
    if (property.name.includes("コンフォリア"))
      featuresToConnect = [
        { id: featurePet.id },
        { id: featureAutoLock.id },
        { id: featureDeliveryBox.id },
        { id: featureFreeInternet.id },
      ];
    if (property.name.includes("メゾネット"))
      featuresToConnect = [{ id: featurePet.id }, { id: featureBalcony.id }];
    if (property.name.includes("ラ・トゥール"))
      featuresToConnect = [
        { id: featurePet.id },
        { id: featureBalcony.id },
        { id: featureAutoLock.id },
        { id: featureDeliveryBox.id },
      ];
    if (property.name.includes("パークマンション"))
      featuresToConnect = [
        { id: featureBalcony.id },
        { id: featureAutoLock.id },
        { id: featureDeliveryBox.id },
      ];
    if (property.name.includes("白金台の戸建て"))
      featuresToConnect = [{ id: featurePet.id }, { id: featureBalcony.id }];
    if (property.name.includes("高輪ゲートウェイ"))
      featuresToConnect = [
        { id: featureAutoLock.id },
        { id: featureSeparateBathToilet.id },
        { id: featureDeliveryBox.id },
        { id: featureFreeInternet.id },
      ];

    if (featuresToConnect.length > 0) {
      await prisma.property.update({
        where: { id: property.id },
        data: { features: { connect: featuresToConnect } },
      });
    }
  }

  console.log("Features connected to properties.");
  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
