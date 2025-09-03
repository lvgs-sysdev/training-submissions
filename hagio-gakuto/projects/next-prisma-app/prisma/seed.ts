import { PrismaClient, Prisma } from "@prisma/client";

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

// 挿入する家賃補助対象の住所データ
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
  // Role
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

  // PropertyType, Layout, Feature
  const [typeMansion, typeHouse, typeApartment] = await Promise.all([
    prisma.propertyType.create({ data: { name: "マンション" } }),
    prisma.propertyType.create({ data: { name: "戸建て" } }),
    prisma.propertyType.create({ data: { name: "アパート" } }),
  ]);
  const [
    layout1LDK,
    layout2LDK,
    layout1K,
    layout1R,
    layout1DK,
    layout2K,
    layout2DK,
    layout3LDK,
  ] = await Promise.all([
    prisma.layout.create({ data: { name: "1LDK" } }),
    prisma.layout.create({ data: { name: "2LDK" } }),
    prisma.layout.create({ data: { name: "1K" } }),
    prisma.layout.create({ data: { name: "1R" } }),
    prisma.layout.create({ data: { name: "1DK" } }),
    prisma.layout.create({ data: { name: "2K" } }),
    prisma.layout.create({ data: { name: "2DK" } }),
    prisma.layout.create({ data: { name: "3LDK" } }),
  ]);
  const [
    featurePet,
    featureBalcony,
    featureAutoLock,
    featureSeparateBathToilet,
    featureDeliveryBox,
    featureFreeInternet,
  ] = await Promise.all([
    prisma.feature.create({ data: { name: "ペット可" } }),
    prisma.feature.create({ data: { name: "バルコニー" } }),
    prisma.feature.create({ data: { name: "オートロック" } }),
    prisma.feature.create({ data: { name: "風呂トイレ別" } }),
    prisma.feature.create({ data: { name: "宅配ボックス" } }),
    prisma.feature.create({ data: { name: "インターネット無料" } }),
  ]);

  // ImageCategory, InquiryCategory
  const [categoryExterior, categoryInterior, categoryFloorPlan] =
    await Promise.all([
      prisma.imageCategory.create({ data: { name: "外観" } }),
      prisma.imageCategory.create({ data: { name: "内観" } }),
      prisma.imageCategory.create({ data: { name: "間取り図" } }),
    ]);
  await Promise.all([
    prisma.inquiryCategory.create({ data: { name: "内見申し込み" } }),
    prisma.inquiryCategory.create({ data: { name: "契約申し込み" } }),
    prisma.inquiryCategory.create({ data: { name: "その他" } }),
  ]);

  // Workplace
  const workplaceShibuya = await prisma.workplace.create({
    data: { id: 1, name: "渋谷拠点・半蔵門支店" },
  });

  console.log("Master data created.");

  // --- 2. 家賃補助対象住所の作成 ---
  const rentAllowanceAddresses: Prisma.RentAllowanceAddressCreateManyInput[] =
    [];
  const prefecture = "東京都";
  for (const group of specifiedAddresses) {
    for (const town of group.towns) {
      if (group.chomes) {
        for (const chome of group.chomes) {
          rentAllowanceAddresses.push({
            prefecture,
            city: group.city,
            town,
            chome: String(chome),
            workplaceId: workplaceShibuya.id,
          });
        }
      } else {
        // chomeがない町名は、丁目を設定しない
        rentAllowanceAddresses.push({
          prefecture,
          city: group.city,
          town,
          chome: null,
          workplaceId: workplaceShibuya.id,
        });
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

  // --- 3. 仮物件の作成 (BuildingとUnitに分割) ---
  const propertySeedData = [
    // ここに元の`property.createMany`の`data`配列をコピー＆ペースト
    {
      oldName: "パークアクシス渋谷神南",
      priceRent: 50000,
      zipCode: "150-0041",
      prefecture: "東京都",
      city: "渋谷区",
      town: "神南",
      chome: "1",
      block: "20",
      buildingName: "パークアクシス渋谷神南",
      nearestStation: "渋谷駅",
      walkToStation: 8,
      areaSqm: 45.5,
      buildDate: new Date("2025-04-01"),
      floor: 12,
      totalFloors: 15,
      roomNumber: "1201",
      isEmpty: true,
      propertyTypeId: typeMansion.id,
      layoutId: layout1R.id,
    },
    {
      oldName: "代官山アドレス ザ・タワー",
      priceRent: 45000,
      zipCode: "150-0034",
      prefecture: "東京都",
      city: "渋谷区",
      town: "代官山町",
      chome: "17",
      block: "1",
      buildingName: "ザ・タワー",
      nearestStation: "代官山駅",
      walkToStation: 1,
      areaSqm: 80.2,
      buildDate: new Date("2022-08-01"),
      floor: 25,
      totalFloors: 36,
      roomNumber: "2505",
      isEmpty: false,
      propertyTypeId: typeMansion.id,
      layoutId: layout2LDK.id,
    },
    {
      oldName: "中目黒アトラスタワー",
      priceRent: 80000,
      zipCode: "153-0051",
      prefecture: "東京都",
      city: "目黒区",
      town: "上目黒",
      chome: "1",
      block: "26",
      buildingName: "アトラスタワー",
      nearestStation: "中目黒駅",
      walkToStation: 2,
      areaSqm: 65.0,
      buildDate: new Date("2021-10-01"),
      floor: 30,
      totalFloors: 45,
      roomNumber: "3001",
      isEmpty: true,
      propertyTypeId: typeMansion.id,
      layoutId: layout2LDK.id,
    },
    {
      oldName: "世田谷公園近くのアパート",
      priceRent: 120000,
      zipCode: "154-0001",
      prefecture: "東京都",
      city: "世田谷区",
      town: "池尻",
      chome: "1",
      block: "5",
      buildingName: "グリーンハイツ",
      nearestStation: "三軒茶屋駅",
      walkToStation: 12,
      areaSqm: 25.0,
      buildDate: new Date("2024-02-01"),
      floor: 1,
      totalFloors: 2,
      roomNumber: "101",
      isEmpty: true,
      propertyTypeId: typeApartment.id,
      layoutId: layout1K.id,
    },
    {
      oldName: "松濤の戸建て",
      priceRent: 80000,
      zipCode: "150-0046",
      prefecture: "東京都",
      city: "渋谷区",
      town: "松濤",
      chome: "1",
      block: "2",
      buildingName: null,
      nearestStation: "神泉駅",
      walkToStation: 7,
      areaSqm: 150.0,
      buildDate: new Date("2023-09-01"),
      floor: 1,
      totalFloors: 2,
      roomNumber: null,
      isEmpty: true,
      propertyTypeId: typeHouse.id,
      layoutId: layout2LDK.id,
    },
    {
      oldName: "広尾ガーデンヒルズ",
      priceRent: 600000,
      zipCode: "150-0012",
      prefecture: "東京都",
      city: "渋谷区",
      town: "広尾",
      chome: "4",
      block: "26",
      buildingName: "広尾ガーデンヒルズ H棟",
      nearestStation: "広尾駅",
      walkToStation: 6,
      areaSqm: 120.5,
      buildDate: new Date("2019-05-20"),
      floor: 3,
      totalFloors: 10,
      roomNumber: "H-302",
      isEmpty: true,
      propertyTypeId: typeMansion.id,
      layoutId: layout3LDK.id,
    },
    {
      oldName: "ザ・パークハウス 西麻布レジデンス",
      priceRent: 55000,
      zipCode: "106-0031",
      prefecture: "東京都",
      city: "港区",
      town: "西麻布",
      chome: "4",
      block: "26",
      buildingName: "ザ・パークハウス西麻布",
      nearestStation: "六本木駅",
      walkToStation: 9,
      areaSqm: 95.0,
      buildDate: new Date("2024-11-15"),
      floor: 18,
      totalFloors: 24,
      roomNumber: "1804",
      isEmpty: false,
      propertyTypeId: typeMansion.id,
      layoutId: layout2LDK.id,
    },
  ];

  const createdUnits: { id: number; oldName: string }[] = [];

  for (const prop of propertySeedData) {
    const building = await prisma.building.create({
      data: {
        name: prop.buildingName ?? prop.oldName,
        zipCode: prop.zipCode,
        prefecture: prop.prefecture,
        city: prop.city,
        town: prop.town,
        chome: prop.chome,
        block: prop.block,
        nearestStation: prop.nearestStation,
        walkToStation: prop.walkToStation,
        buildDate: prop.buildDate,
        totalFloors: prop.totalFloors,
        propertyTypeId: prop.propertyTypeId,
      },
    });

    const unit = await prisma.unit.create({
      data: {
        priceRent: prop.priceRent,
        areaSqm: prop.areaSqm,
        floor: prop.floor,
        roomNumber: prop.roomNumber,
        isEmpty: prop.isEmpty,
        buildingId: building.id,
        layoutId: prop.layoutId,
      },
    });
    createdUnits.push({ id: unit.id, oldName: prop.oldName });
  }
  console.log(`${propertySeedData.length} buildings and units created.`);

  // --- 4. 作成した物件に画像を紐付ける ---
  const allBuildings = await prisma.building.findMany({ select: { id: true } });
  const imageUrls = [
    "/images/properties/apartment.jpg",
    "/images/properties/building.jpg",
    "/images/properties/single-house.jpg",
  ];

  const imagesToCreate: Prisma.ImageCreateManyInput[] = [];
  for (const building of allBuildings) {
    for (const url of imageUrls) {
      imagesToCreate.push({
        imageUrl: url,
        categoryId: categoryExterior.id,
        buildingId: building.id,
        // unitIdはNULLのまま（建物共通画像）
      });
    }
  }
  await prisma.image.createMany({ data: imagesToCreate });
  console.log(`${imagesToCreate.length} property images created.`);

  // --- 5. 作成したUnitにFeatureを紐付ける ---
  for (const unit of createdUnits) {
    let featureIdsToConnect: number[] = [];

    // 元のロジックを流用して、接続するFeatureのIDを決定
    if (unit.oldName.includes("パークアクシス"))
      featureIdsToConnect = [featureAutoLock.id, featureSeparateBathToilet.id];
    if (unit.oldName.includes("アドレス"))
      featureIdsToConnect = [
        featureAutoLock.id,
        featureBalcony.id,
        featureDeliveryBox.id,
      ];
    if (unit.oldName.includes("アトラス"))
      featureIdsToConnect = [
        featureAutoLock.id,
        featureBalcony.id,
        featureDeliveryBox.id,
        featureFreeInternet.id,
      ];
    if (unit.oldName.includes("アパート"))
      featureIdsToConnect = [featureSeparateBathToilet.id, featureBalcony.id];
    if (unit.oldName.includes("松濤の戸建て"))
      featureIdsToConnect = [featurePet.id, featureBalcony.id];
    if (unit.oldName.includes("ガーデンヒルズ"))
      featureIdsToConnect = [
        featurePet.id,
        featureBalcony.id,
        featureAutoLock.id,
      ];
    if (unit.oldName.includes("パークハウス"))
      featureIdsToConnect = [
        featureAutoLock.id,
        featureDeliveryBox.id,
        featureBalcony.id,
      ];

    if (featureIdsToConnect.length > 0) {
      const unitFeaturesData = featureIdsToConnect.map((featureId) => ({
        unitId: unit.id,
        featureId: featureId,
      }));
      await prisma.unitFeature.createMany({
        data: unitFeaturesData,
        skipDuplicates: true,
      });
    }
  }
  console.log("Features connected to units.");

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
