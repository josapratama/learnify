import { PrismaClient, User } from "@prisma/client";

import { iot_l1 } from "../content/iot/m1_l1.ts";
import { iot_l2 } from "../content/iot/m1_l2.ts";
import { iot_l3 } from "../content/iot/m2_l3.ts";
import { iot_l4 } from "../content/iot/m2_l4.ts";
import { iot_l5 } from "../content/iot/m3_l5.ts";
import { iot_l6 } from "../content/iot/m3_l6.ts";
import { iot_l7 } from "../content/iot/m4_l7.ts";
import { iot_l8 } from "../content/iot/m4_l8.ts";
import { iot_l9 } from "../content/iot/m5_l9.ts";
import { iot_l10 } from "../content/iot/m5_l10.ts";
import { iot_l11 } from "../content/iot/m6_l11.ts";
import { iot_l12 } from "../content/iot/m6_l12.ts";
import { iot_l13 } from "../content/iot/m7_l13.ts";
import { iot_l14 } from "../content/iot/m7_l14.ts";
import { iot_l15 } from "../content/iot/m8_l15.ts";
import { iot_expert_l1 } from "../content/iot/m9_l16.ts";
import { iot_expert_l2 } from "../content/iot/m10_l17.ts";

export async function seedIoT(prisma: PrismaClient, instructor: User) {
  const course = await prisma.course.create({
    data: {
      title: "Mastering IoT dengan ESP32 & Blynk",
      slug: "mastering-iot-esp32",
      description:
        "Bangun sistem Smart Home Anda sendiri dari nol menggunakan ESP32 dan platform Blynk IoT.",
      price: 199000,
      category: "Internet of Things",
      level: "intermediate",
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  // Helper: buat section + lessons
  async function createSection(
    title: string,
    orderIndex: number,
    lessons: {
      title: string;
      slug: string;
      bodyText: string;
      isPreview?: boolean;
    }[],
  ) {
    const section = await prisma.section.create({
      data: { title, orderIndex, courseId: course.id },
    });
    await prisma.lesson.createMany({
      data: lessons.map((l, i) => ({
        title: l.title,
        slug: l.slug,
        contentType: "article",
        bodyText: l.bodyText,
        orderIndex: i + 1,
        sectionId: section.id,
        isPreview: l.isPreview ?? false,
      })),
    });
  }

  await createSection("Modul 1: Pengenalan & Hardware", 1, [
    {
      title: "Apa itu IoT?",
      slug: "apa-itu-iot",
      bodyText: iot_l1,
      isPreview: true,
    },
    {
      title: "Mengenal ESP32 & Pinout",
      slug: "mengenal-esp32",
      bodyText: iot_l2,
    },
  ]);

  await createSection("Modul 2: Persiapan & Hello World", 2, [
    {
      title: "Setup Arduino IDE & Driver",
      slug: "setup-arduino-iot",
      bodyText: iot_l3,
    },
    {
      title: "Hello World: LED Blink",
      slug: "led-blink-iot",
      bodyText: iot_l4,
    },
  ]);

  await createSection("Modul 3: Membaca Sensor", 3, [
    {
      title: "Sensor Digital (Button/PIR)",
      slug: "sensor-digital-iot",
      bodyText: iot_l5,
    },
    {
      title: "Sensor Analog (LDR/Potensio)",
      slug: "sensor-analog-iot",
      bodyText: iot_l6,
    },
  ]);

  await createSection("Modul 4: Konektivitas", 4, [
    {
      title: "Menghubungkan ke WiFi",
      slug: "wifi-connection-iot",
      bodyText: iot_l7,
    },
    { title: "Protokol MQTT", slug: "mqtt-protocol-iot", bodyText: iot_l8 },
  ]);

  await createSection("Modul 5: Platform Blynk IoT", 5, [
    { title: "Setup Blynk Cloud", slug: "blynk-setup-iot", bodyText: iot_l9 },
    {
      title: "Proyek Akhir Smart Home",
      slug: "proyek-akhir-iot",
      bodyText: iot_l10,
    },
  ]);

  await createSection("Modul 6: Optimasi & Power Management", 6, [
    {
      title: "Deep Sleep & Low Power",
      slug: "deep-sleep-iot",
      bodyText: iot_l11,
    },
    { title: "Dual Core Processing", slug: "dual-core-iot", bodyText: iot_l12 },
  ]);

  await createSection("Modul 7: Data Storage", 7, [
    { title: "SPIFFS File System", slug: "spiffs-iot", bodyText: iot_l13 },
    { title: "Menggunakan SD Card", slug: "sd-card-iot", bodyText: iot_l14 },
  ]);

  await createSection("Modul 8: Troubleshooting & Tips", 8, [
    {
      title: "Tips Troubleshooting Hardware",
      slug: "troubleshooting-iot",
      bodyText: iot_l15,
    },
  ]);

  await createSection("Modul 9: Industrial IoT & LoRaWAN", 9, [
    {
      title: "Konsep Industrial IoT",
      slug: "iiot-concepts",
      bodyText: iot_expert_l1,
    },
  ]);

  await createSection("Modul 10: AI at the Edge (TinyML)", 10, [
    {
      title: "Mengenal TinyML di ESP32",
      slug: "tinyml-esp32",
      bodyText: iot_expert_l2,
    },
  ]);

  console.log("✅ IoT course seeded");
  return course;
}
