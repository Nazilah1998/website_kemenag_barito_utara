export const getApaKataMereka = (locale = "id") => {
  const data = {
    id: [
      {
        name: "H. Nasaruddin Umar",
        position: "Menteri Agama Republik Indonesia",
        image: "/assets/images/menteri.png",
        quote: [
          "Mari kita wakafkan diri untuk berkhidmat kepada umat melalui Kementerian Agama. Kehadiran kita bukan sekadar menjalankan tugas, melainkan membawa misi kedamaian dan harmoni bagi seluruh bangsa.",
          "Kementerian Agama bukan tempat untuk mencari kekayaan materi, melainkan ladang untuk menanam keberkahan dan pengabdian yang tulus bagi agama, nusa, dan bangsa.",
        ],
      },
      {
        name: "H. Muhammad Yusi Abdhian, S.HI., M.HI.",
        position: "Kepala Kantor Wilayah Kemenag Provinsi Kalimantan Tengah",
        image: "/assets/images/Kanwil.png",
        quote: [
          "Hijrah adalah keniscayaan menuju kehidupan yang lebih bermakna. Ia adalah pilar utama dalam memperbaiki arah perjuangan dari penyimpangan menuju keridaan Ilahi. Bahkan para Nabi dan Rasul pun melakukan hijrah sebagai bentuk ketaatan.",
          "Hakikat hijrah yang sesungguhnya adalah perjalanan batin menuju Allah SWT, menguatkan keteguhan hati dalam menjalankan amanah, serta meninggalkan segala bentuk kemungkaran demi meraih keberkahan hidup.",
        ],
      },
      {
        name: "H. Arbaja, S.Ag., M.A.P",
        position: "Kepala Kantor Kemenag Kabupaten Barito Utara",
        image: "/assets/images/Kemenag-kepala.png",
        quote: [
          "Keberagaman adalah ujian keimanan dalam berbangsa. Mari kita jadikan perbedaan sebagai warna yang memperindah persatuan, bukan alasan untuk merasa paling benar yang berujung pada perpecahan.",
          "Satukan energi, tuangkan dalam kerja nyata sebagai amal bakti bagi masyarakat. Mari kita jaga marwah Kementerian Agama dengan profesionalitas, integritas, dan ketulusan dalam melayani umat.",
        ],
      },
    ],
    en: [
      {
        name: "H. Nasaruddin Umar",
        position: "Minister of Religious Affairs of the Republic of Indonesia",
        image: "/assets/images/menteri.png",
        quote: [
          "Let us dedicate ourselves to serving the community through the Ministry of Religious Affairs. Our presence is not just to perform tasks, but to bring a mission of peace and harmony for the entire nation.",
          "The Ministry of Religious Affairs is not a place to seek material wealth, but a field to plant blessings and sincere devotion for religion, country, and nation.",
        ],
      },
      {
        name: "H. Muhammad Yusi Abdhian, S.HI., M.HI.",
        position:
          "Head of the Regional Office of the Ministry of Religious Affairs, Central Kalimantan Province",
        image: "/assets/images/Kanwil.png",
        quote: [
          "Migration (Hijrah) is a necessity towards a more meaningful life. It is the main pillar in correcting the direction of struggle from deviation towards Divine pleasure. Even the Prophets and Messengers migrated as a form of obedience.",
          "The true essence of migration is an inner journey towards Allah SWT, strengthening steadfastness in carrying out mandates, and leaving all forms of evil to achieve the blessings of life.",
        ],
      },
      {
        name: "H. Arbaja, S.Ag., M.A.P",
        position:
          "Head of the Office of the Ministry of Religious Affairs, Barito Utara Regency",
        image: "/assets/images/Kemenag-kepala.png",
        quote: [
          "Diversity is a test of faith in the nation. Let us make differences as colors that beautify unity, not as a reason to feel most righteous which leads to division.",
          "Unite energy, pour it into real work as service to the community. Let us maintain the dignity of the Ministry of Religious Affairs with professionalism, integrity, and sincerity in serving the people.",
        ],
      },
    ],
  };

  return data[locale] || data.id;
};
