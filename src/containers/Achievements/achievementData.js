const m = (minutes) => {
  return minutes * 60 * 1000;
};

const h = (hours) => {
  return hours * 60 * 60 * 1000;
};

const hm = (hours, minutes) => {
  return h(hours) + m(minutes);
};

export const achievementData = {
  unique: {
    readingTest: {
      points: 1,
    },
  },
  daily: {
    exercise: {
      count: {
        levels: [0, 10],
        points: [0, 1],
      },
      time: {
        levels: [0, m(15)],
        points: [0, 1],
      },
    },
    readingExercise: {
      count: {
        levels: [0, 4],
        points: [0, 1],
      },
      time: {
        levels: [0, m(10)],
        points: [0, 1],
      },
    },
    helpExercise: {
      count: {
        levels: [0, 7],
        points: [0, 1],
      },
      time: {
        levels: [0, m(5)],
        points: [0, 1],
      },
    },
    readingTest: {
      count: {
        levels: [0, 2],
        points: [0, 1],
      },
      time: {
        levels: [0, m(5)],
        points: [0, 1],
      },
    },
    readingAid: {
      count: {
        levels: [0, 2],
        points: [0, 1],
      },
      time: {
        levels: [0, m(5)],
        points: [0, 1],
      },
    },
    scrolling: {
      count: {
        levels: [0, 2],
        points: [0, 1],
      },
      time: {
        levels: [0, m(5)],
        points: [0, 1],
      },
    },
    disappearing: {
      count: {
        levels: [0, 2],
        points: [0, 1],
      },
      time: {
        levels: [0, m(5)],
        points: [0, 1],
      },
    },
    wordGroups: {
      count: {
        levels: [0, 2],
        points: [0, 1],
      },
      time: {
        levels: [0, m(5)],
        points: [0, 1],
      },
    },
    verticalReading: {
      count: {
        levels: [0, 2],
        points: [0, 1],
      },
      time: {
        levels: [0, m(5)],
        points: [0, 1],
      },
    },
    movingWordGroups: {
      count: {
        levels: [0, 2],
        points: [0, 1],
      },
      time: {
        levels: [0, m(5)],
        points: [0, 1],
      },
    },
    schulteTables: {
      count: {
        levels: [0, 5],
        points: [0, 1],
      },
      time: {
        levels: [0, m(3)],
        points: [0, 1],
      },
    },
    concentration: {
      count: {
        levels: [0, 4],
        points: [0, 1],
      },
      time: {
        levels: [0, m(4)],
        points: [0, 1],
      },
    },
    visualVocabulary: {
      count: {
        levels: [0, 4],
        points: [0, 1],
      },
      time: {
        levels: [0, m(4)],
        points: [0, 1],
      },
    },
  },
  weekly: {
    exercise: {
      count: {
        levels: [0, 25],
        points: [0, 3],
      },
      time: {
        levels: [0, m(50)],
        points: [0, 3],
      },
    },
    readingExercise: {
      count: {
        levels: [0, 20],
        points: [0, 3],
      },
      time: {
        levels: [0, m(40)],
        points: [0, 3],
      },
    },
    helpExercise: {
      count: {
        levels: [0, 20],
        points: [0, 3],
      },
      time: {
        levels: [0, m(15)],
        points: [0, 3],
      },
    },
  },
  monthly: {
    exercise: {
      count: {
        levels: [0, 60],
        points: [0, 7],
      },
      time: {
        levels: [0, hm(2, 30)],
        points: [0, 7],
      },
    },
    readingExercise: {
      count: {
        levels: [0, 30],
        points: [0, 7],
      },
      time: {
        levels: [0, h(2)],
        points: [0, 7],
      },
    },
    helpExercise: {
      count: {
        levels: [0, 30],
        points: [0, 7],
      },
      time: {
        levels: [0, m(30)],
        points: [0, 7],
      },
    },
  },
  progress: {
    // Not used
    achievementPoints: {
      levels: [0, 10, 50, 100, 150, 200, 250, 300, 400, 500, 750],
      points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    exercise: {
      count: {
        levels: [0, 7, 30, 70, 120, 190, 270, 370, 480, 600, 750],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(15), h(1), hm(2, 20), hm(4, 20), hm(6, 40), hm(9, 30), h(13), h(17), hm(21, 20), h(27)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    readingExercise: {
      count: {
        levels: [0, 5, 20, 45, 80, 125, 180, 245, 320, 405, 500],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(12), m(55), h(2), hm(3, 20), hm(5, 40), hm(8, 20), hm(11, 20), hm(14, 40), hm(18, 40), h(23)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      // Not used
      consecutiveDays: {
        levels: [0, 2, 3, 4, 5, 6, 7, 10, 14], // Current + Best??
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      },
      // Not used
      uniqueTexts: {
        levels: [0, 5, 10, 15, 20, 25, 30, 40, 50],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      },
      // Not used
      textRatings: {
        levels: [0, 1, 3, 5, 7, 10, 20, 25, 40, 50, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    helpExercise: {
      count: {
        levels: [0, 3, 12, 25, 45, 70, 100, 135, 180, 230, 300],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(3), m(9), m(20), m(35), m(55), hm(1, 20), hm(1, 50), hm(2, 20), h(3), h(4)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    // Not used
    /*
    comprehensionTest: {
      count: {
        levels: [0, 2, 5, 10, 25, 50, 75, 100, 150, 200, 250],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, 300000],
        points: [0, 1],
      },
      perfectTests: {
        levels: [0, 1, 2, 3, 5, 7, 10, 15, 20, 25, 35, 50, 75, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      },
    },
    */
    readingTest: {
      count: {
        levels: [0, 2, 5, 10, 15, 25, 35, 50, 65, 80, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(5), m(10), m(25), m(45), hm(1, 10), hm(1, 40), hm(2, 15), h(3), hm(3, 45), hm(4, 30)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    readingAid: {
      count: {
        levels: [0, 2, 5, 10, 15, 25, 35, 50, 65, 80, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(5), m(10), m(25), m(45), hm(1, 10), hm(1, 40), hm(2, 15), h(3), hm(3, 45), hm(4, 30)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    scrolling: {
      count: {
        levels: [0, 2, 5, 10, 15, 25, 35, 50, 65, 80, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(5), m(10), m(25), m(45), hm(1, 10), hm(1, 40), hm(2, 15), h(3), hm(3, 45), hm(4, 30)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    disappearing: {
      count: {
        levels: [0, 2, 5, 10, 15, 25, 35, 50, 65, 80, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(5), m(10), m(25), m(45), hm(1, 10), hm(1, 40), hm(2, 15), h(3), hm(3, 45), hm(4, 30)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    wordGroups: {
      count: {
        levels: [0, 2, 5, 10, 15, 25, 35, 50, 65, 80, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(5), m(10), m(25), m(45), hm(1, 10), hm(1, 40), hm(2, 15), h(3), hm(3, 45), hm(4, 30)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    verticalReading: {
      count: {
        levels: [0, 2, 5, 10, 15, 25, 35, 50, 65, 80, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(5), m(10), m(25), m(45), hm(1, 10), hm(1, 40), hm(2, 15), h(3), hm(3, 45), hm(4, 30)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    movingWordGroups: {
      count: {
        levels: [0, 2, 5, 10, 15, 25, 35, 50, 65, 80, 100],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(5), m(10), m(25), m(45), hm(1, 10), hm(1, 40), hm(2, 15), h(3), hm(3, 45), hm(4, 30)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    schulteTables: {
      count: {
        levels: [0, 2, 5, 10, 20, 30, 45, 60, 80, 100, 125],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(1), m(3), m(7), m(13), m(20), m(30), m(40), m(55), m(70), m(85)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    concentration: {
      count: {
        levels: [0, 2, 6, 14, 25, 40, 55, 75, 100, 125, 150],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(2), m(6), m(15), m(25), m(40), h(1), hm(1, 20), hm(1, 40), hm(2, 10), hm(2, 40)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      // Not used
      perfectResults: {
        levels: [0, 1],
        points: [0, 1],
      },
    },
    visualVocabulary: {
      count: {
        levels: [0, 2, 6, 14, 25, 40, 55, 75, 100, 125, 150],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      time: {
        levels: [0, m(2), m(6), m(15), m(25), m(40), h(1), hm(1, 20), hm(1, 40), hm(2, 10), hm(2, 40)],
        points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
  },
};

export default achievementData;
