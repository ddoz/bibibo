// Game Modes & Question Generators for Clock Learning Mini-Game (Bilingual ID/EN & 12h/24h)

export function generateClockQuestion(mode = 'tebak', level = 1, lang = 'id', is24h = false) {
  let hour = Math.floor(Math.random() * 12) + 1; // 1 - 12
  let isPM = Math.random() < 0.5;
  let minute = 0;

  if (level === 1) {
    // Level 1: Jam Pas (00)
    minute = 0;
  } else if (level === 2) {
    // Level 2: Jam Pas & Setengah (00, 30)
    minute = Math.random() < 0.5 ? 0 : 30;
  } else if (level === 3) {
    // Level 3: Seperempat (00, 15, 30, 45)
    const options = [0, 15, 30, 45];
    minute = options[Math.floor(Math.random() * options.length)];
  } else if (level === 4) {
    // Level 4: Setiap 5 Menit (0, 5, 10, 15, ..., 55)
    minute = Math.floor(Math.random() * 12) * 5;
  } else {
    // Level 5: Presisi 1 Menit (0 - 59)
    minute = Math.floor(Math.random() * 60);
  }

  const displayHour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
  const timeString = formatDigitalTime(hour, minute, is24h, isPM);
  const phrase = getTimePhrase(hour, minute, lang, is24h, isPM);

  if (mode === 'tebak' || mode === 'suara') {
    // Generate 4 multiple choice options
    const choices = [phrase];
    while (choices.length < 4) {
      let wrongHour = Math.floor(Math.random() * 12) + 1;
      let wrongMinute;
      if (level === 1) wrongMinute = 0;
      else if (level === 2) wrongMinute = Math.random() < 0.5 ? 0 : 30;
      else if (level === 3) wrongMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      else if (level === 4) wrongMinute = Math.floor(Math.random() * 12) * 5;
      else wrongMinute = Math.floor(Math.random() * 60);

      let wrongPM = Math.random() < 0.5;
      let wrongPhrase = getTimePhrase(wrongHour, wrongMinute, lang, is24h, wrongPM);

      if (!choices.includes(wrongPhrase)) {
        choices.push(wrongPhrase);
      }
    }
    // Shuffle choices
    choices.sort(() => Math.random() - 0.5);

    return {
      targetHour: hour,
      targetMinute: minute,
      isPM: isPM,
      displayHour24: displayHour24,
      targetPhrase: phrase,
      timeString: timeString,
      choices: choices,
      correctChoice: phrase
    };
  }

  // Mode 'atur'
  return {
    targetHour: hour,
    targetMinute: minute,
    isPM: isPM,
    displayHour24: displayHour24,
    targetPhrase: phrase,
    timeString: timeString
  };
}

export function formatDigitalTime(hour, minute, is24h = false, isPM = false) {
  let displayHour = hour;
  let period = isPM ? 'PM' : 'AM';

  if (is24h) {
    if (isPM && hour < 12) displayHour = hour + 12;
    if (!isPM && hour === 12) displayHour = 0;
    return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  } else {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
  }
}

/**
 * Format time phrasing in Indonesian or English
 */
export function getTimePhrase(hour, minute, lang = 'id', is24h = false, isPM = false) {
  if (lang === 'en') {
    return getEnglishPhrase(hour, minute, is24h, isPM);
  } else {
    return getIndonesianPhrase(hour, minute, is24h, isPM);
  }
}

function getIndonesianPhrase(hour, minute, is24h, isPM) {
  const hourNames = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas', 'Dua Belas'];
  const currentHourName = hourNames[hour] || String(hour);
  const nextHourName = hourNames[(hour % 12) + 1];
  const timeOfDay = isPM ? (hour >= 6 && hour < 12 ? 'Malam' : 'Siang') : (hour >= 6 && hour < 12 ? 'Pagi' : 'Dini Hari');

  if (is24h) {
    let hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    return `Pukul ${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  if (minute === 0) {
    return `Jam ${currentHourName} Pas`;
  } else if (minute === 30) {
    return `Setengah ${nextHourName}`;
  } else if (minute === 15) {
    return `Jam ${currentHourName} Seperempat`;
  } else if (minute === 45) {
    return `Jam ${nextHourName} Kurang Seperempat`;
  } else if (minute < 30) {
    return `Jam ${currentHourName} Lewat ${minute} Menit`;
  } else {
    const remainingMins = 60 - minute;
    return `Jam ${nextHourName} Kurang ${remainingMins} Menit`;
  }
}

function getEnglishPhrase(hour, minute, is24h, isPM) {
  const numToWords = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
  const currentHourName = numToWords[hour] || String(hour);
  const nextHourName = numToWords[(hour % 12) + 1];
  const period = isPM ? 'PM' : 'AM';

  if (is24h) {
    let hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
    return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')} Hours`;
  }

  if (minute === 0) {
    return `${hour} o'clock ${period}`;
  } else if (minute === 30) {
    return `Half past ${hour} (${hour}:30 ${period})`;
  } else if (minute === 15) {
    return `Quarter past ${hour} (${hour}:15 ${period})`;
  } else if (minute === 45) {
    return `Quarter to ${(hour % 12) + 1}`;
  } else if (minute < 30) {
    return `${minute} minutes past ${hour}`;
  } else {
    return `${60 - minute} minutes to ${(hour % 12) + 1}`;
  }
}
