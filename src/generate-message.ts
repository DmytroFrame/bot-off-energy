import type { QueueData } from "./interfaces";

const abusiveMessages: Record<number, string> = {
  0: "годин, тобі повезло",
  1: "годину, хуйня",
  2: "години, ну можна і протерпіти",
  3: "години, можна і подрочити правда, не всі зрозуміють",
  4: "годин, сьогодні зелений фюрер добрий",
  5: "годин, в темряві ти гарно пахнеш",
  6: "годин, а міг би посидіти за компом",
  7: "годин, навіть твоя мамця вахуй",
  8: "годин, ТУТ МОГЛА БУТИ ВАША РЕКЛАМА БУРЖУЙОК",
  9: "годин, зелений фюрер сьогодні розішовся по повній",
  10: "годин, чувак, без обід, але в печері було ліпше",
  11: "годин, ТУТ МОГЛА БУТИ ВАША РЕКЛАМА БУРЖУЙОК",
  12: "годин, ТУТ МОГЛА БУТИ ВАША РЕКЛАМА БУРЖУЙОК",
  13: "годин, ТУТ МОГЛА БУТИ ВАША РЕКЛАМА БУРЖУЙОК",
  14: "годин, ТУТ МОГЛА БУТИ ВАША РЕКЛАМА БУРЖУЙОК",
  15: "годин, ТУТ МОГЛА БУТИ ВАША РЕКЛАМА БУРЖУЙОК",
  16: "годин, ТУТ МОГЛА БУТИ ВАША РЕКЛАМА БУРЖУЙОК",
  17: "годин, ТУТ МОГЛА БУТИ ВАША РЕКЛАМА БУРЖУЙОК",
  18: "ГОДИН ХАХАХХАХХАХАХАХХА ЕБАТЬ ТИ ЛОШАРА",
  19: "ГОДИН ХАХАХХАХХАХААХХАХХА ЕБАТЬ ТИ ЛОШАРА",
  20: "ГОДИН ХАХАХХАХХААХХАХАХХХАХАХХА ЕБАТЬ ТИ ЛОШАРА",
  21: "ГОДИН ХАХАХХАХХАХАХХАХАХХААХХААХХА ЕБАТЬ ТИ ЛОШАРА",
  22: "ГОДИН ХАХАХХАХХАХХХАХХААХАХАХАХАХХА ЕБАТЬ ТИ ЛОШАРА",
  23: "ГОДИН ХАХАХХАХХАХАХХАХАХХААХХАХАХАХАХАХАХХА ЕБАТЬ ТИ ЛОШАРА",
  24: "ГОДИН ХАХАХХАХХАХАХХАХАХХААХХАХАХАХХАХАХХААХХАХАХАХАХАХАХХА ЕБАТЬ ТИ ЛОШАРА",
};

export function generateMessage(data: QueueData) {
  let payload = `Черв! Дле тебе є нове оновлення\n`;
  payload += `${data.current.note}`;

  for (const day of Object.values(data.graphs)) {
    const countHours = day.hoursList.filter((item) => item.electricity).length;
    const intervals: string[] = [];
    let start: string | null = null;

    day.hoursList.forEach(({ electricity, description }) => {
      if (electricity === 1 && start === null) {
        start = description.split("-")[0];
      }

      if (electricity === 0 && start !== null) {
        intervals.push(`${start}-${description.split("-")[0]}`);
        start = null;
      }
    });

    payload += `\nНа: ${day.eventDate}\nНе буде світла ${countHours} ${abusiveMessages[countHours]}`;

    intervals.forEach((interval) => {
      const [from, to] = interval.split("-");
      payload += `\n - з ${from} по ${to}`;
    });
  }

  return payload;
}
