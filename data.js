/* =========================================================================
   TABAN — داده‌های پایه (دسته‌بندی‌ها، تصاویر، قیمت‌های ثابت)
   این فایل فقط «داده‌ی اولیه» است. بعد از اولین بار باز شدن سایت، تمام
   تغییرات (ترتیب، قیمت، تخفیف، حذف/افزودن محصول) در localStorage مرورگر
   خریدار ذخیره می‌شود و این فایل دیگر خوانده نمی‌شود.
   ========================================================================= */

const TABAN_SEED = (function () {

  // ---- ابزار کمکی: چرخاندن یک آرایه قیمتِ «گرد و ثابت» روی تصاویر ----
  function withPrices(images, prices) {
    return images.map(function (src, i) {
      return {
        id: 'p' + Math.random().toString(36).slice(2, 9),
        img: src,
        price: prices[i % prices.length],
        discount: 0 // درصد تخفیف، فقط توسط مدیر تنظیم می‌شود (۰ تا ۸۰)
      };
    });
  }

  // ---------------------------------------------------------------------
  // تصاویر (لینک‌های ارسالی مشتری)
  // ---------------------------------------------------------------------
  const IMG_MANTO = [
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlYV3XxbfH23RFnrLAOhj8ugbM35ZlO2ZXESINun3sRQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8nYyhl2dddE3uew1djsmEABo2iCkLAbAgVxqkcvQ3Wg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlHpOQ27fQW7yH1P1-iFTRYdVdAmugFegfKYx6HvkSgQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwuj7AK3Rvot2AoYhqcIaDOuE_p9md0h8zRKlCf4qimw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzC0qWkCugNFv7q0aEsb2G35cpUvFCZOJR8eY1_xHwkw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTim3G6km8iUCR_9TZBN0aBpxqhMkTmC6SCTUS5sQsncQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT95SSrUW-yqbNdTJl0P6-W6MyBT62C5LDZbkbnajNLBA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToVmAfM6kHGRQI7g2JmnTkDRxaiwyUqyEj6bG-6KTDvQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrtA6UUQsChNRW4DbNsHm6TM5GZnoZ5k16EwScuVdI-Q&s",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpjLUGPOlZCYpIIq79k3oMPPRVUT0Jk88ds3VNkoqUsA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqsS8V-B8hgNKQ_oym25EQSzJoDbUE0N641yTYjrNLvg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAL4l7t3h2CVN8z9KHMy1e1k9bu6U7vNx0qRY4fu_3YA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7dNA880nqNhnuff6ftB-WproYBVxTXYui_mNfj3x9vQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLwJz9SZmX0Wa-iEcOafc7H6WvYSevz_MOmoZMxR89cA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiTRySoeDUx8w3-EDNW6yNRLcfSqhZYLrSi9JDh6EIxQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1pHm3qYhAuTF7kW5KndvvequDU1XQGHP3iJ6jYnGwuw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS38xaxPW1gjiPhCr0AySyXjxRLOoMsl5Aisj4dO8Y5MA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4bvMueSy9KKZ6WVpvUZiBM_nGDrGrUOlOHygGQbxCFA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAiHyTJKg3n_Yh_VskkcAbh9-DumqZutEJoUZd1kfvNg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW9w4U1Lr4jOU6uqMNB_ARF5MLI_8EoA0mqRF5C09lfw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjhngiSteItXNLvcYg-xbG2FT_eUk34WAVW2sOaJUxIg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpPQRYIedgzzS6dgpzLjTYgzBVoWYuhG6dheSly2PWQQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoD1yP-Jd5p2uqkr4I6OOwUp1Zv4AZgjQ-VYS3jR3i5g&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTNaWLCrGO6TYBdOtklzabsxztKCoW3s5CXC_guCcM-g&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXyXUXtxO7V7ZT2XcpBdCR6CxCnqcz5xwi80tQ1XGJ_A&s=10"
  ];

  const IMG_MAJLESI = [
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd2AlsZ6tofKbIEbrd5c9rC9Pb6uoJ3IeuZ-kTEJ2V4w&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUbxXEFxK7tv0kkPY4c2eyN35wygIBc33pjQqoglIACg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTebusYW8bTn5DLBragfroaePGC3nMyNEVFvhmDaHubAw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbCwaDi6Cm6x_qm_IdUOUlEql-GVR9QYYEcm2ffCohqA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5SDb086bfFfQYhNu-gDcYeHoKTG4pejKozg2D_iHL8A&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQilpfFJNkBe9D9OwYXDiC49-g81H1ZlsYv-G1wo4fxEQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeb-bphUJ8kCRJOtXU91wRM06AmqpM3CwF04K5RnfMQQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSriGHLBFwSAV0BaTaiivbYkeJBNkNjkIPY2UHFUnnrTA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS3-hVsiO65ZMvekmRusRL1K3Zhc8zB08G9ZVJ7fgr9w&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQriUOpunMZO_DFEm6zz0VmUsETctk-s6xIQtEhOgtwxw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz60mkO16ki5F9lpES5-8UbhWJc6K3qIQ61zzAmelVIA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ahxl1rKWDYWQbqLExJVQe2G7jFNu_pIQ4L3CnR9KIw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7hcqtVYTBm1yJgw8aRSMmOIUZz0iETJ3x0pYDixumRQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST7iS9A9_hqpCZ7sAZk5MdqmmQUja27YOjMPFsXEu4jw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcjL8RGV9gVlUIp8TUtcwv9EfFSTiGn4IW8kSEEGXfzw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK1q5l3cJ3dXWAKLpiwi_hb4HbX2C5yLckNycUJgyosg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmvw5NlimqhhoMKO3gk092fnYR3qV5O6jNGpLSCIAOtg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGUxFUV3r9lQzkETLP66YSLbRBmGCJzi8imjbqnotRyw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqrVSI_nZ5JXB3wrDuHWFggR73WKBwn44f_R1gCwEDkg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr3JkwYk4eI5VDeqIClEVY_9hvtVxHTL4ehuLPeVW8vg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHcvhSxQB2nMysOnaMIofr73DLNE4bnaeAn527D2Eq1Q&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHY-5K1Ex9rcdFHgCdGwy6WHtcSNWjLVzfz1xCQAeAYw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXZciSIPZOSPr66pCzXKmNcvE54MAXz-SINY_FVBo6rg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT22WYSg7ddSoYj47hzB7eA70Hbpi8Yazl8-qwGXdNhuA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoZOTysIzV67n5Qqr2DpyvZpowUesQ9lPwz9rEw_1sPw&s=10"
  ];

  const IMG_KHANEGI = [
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA1eMr280WCLgd687bDfaUhWsWytxQPuqII422AyBv8w&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKCGMQp9kw6IfwGfF4lmq98EHTZazhzkzAQdcvrr9tZA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF7gbl76bQE8fARP13rFjbjfgSgxwuxKZxK-vEDqKwRw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZuE4VBayNPIb2Er6rs6eVLni0FMop7JI5axlLDld4RA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU62MbHmW0PUsBaZOiTgYfI2kTizM9sWB-v4lNo1LYoQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlZJ3SXGCOFrDb2zcsH8xwfZOUszomIJd3EiLHEsCUPw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo4UANfgGIUSW0wlD4ptzsr7BlBcblxiS5OKi_MdhCgg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz45TADyPLUE6Ri9lyd2mYF1AjPj5ndKIcPlm9W1UDlg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkjmJwlTN3ymkb8jc_OrJ1NLcVzrGPIPbHiJmQWoN5Vw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQuLiLKRcBIgKcyXIy0P_5jFfmpcCXK-kGuGkBmMb7Jw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScueKy-aX32mJyLMXfSScU4gDZwYrqgsWwaVkSZ3DAVw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdxwC_4GQ4f6PneRjgiOjVYJ8qUJvxkauuiuGsG9OZtg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQma1OoWvUX2xczobmYkyHOYTW1Ch-3KUDRocnrM-LtAg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrqO1Z9W5xn_PSwiJUCef8O5Cat9UC5DzvdodHf8K3Ig&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2r05UkphiB1ehqxvIsUmgZ3ntlfScxkobcO9_pjFMDg&s",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXhLCfKobHUZav8xRj_A_kH-apdQTSoAwfGUkcigt84A&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD-Szrf4-Sbn5RlKpRau38sTwOgMkcWDgLaNWtsBNzmA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRekUi6eFkCNmMaEc6oji50B-o_II3F6nCBGhcYJIj4xg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1pV928AetJp3GYn7m1oKu0OHGzzYflte0nsrlD_qwZg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8u1rZo9hvbTq8MaC6Yqzc4XgfwUUeww8ylh3bUEjhgQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcZk4NWlvpOpvG-bBebjYkBQ94U-phzEWyjPqNpEePxA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNhflotPDaz5MrxDxw4iuYVsNYJpqxrQhn0upLtakIWA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcceO50mOhyPEB2Gg6uaFI3uVETbqQHychUf--_fGcQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT24yclwTsUTsibzr7AZVX3rmZJn_hqk8DE1Jff2isTmQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiRdcAW6Q2oEBmFpDDPihzrud91Xkm_sfWW9Q7vaT-BA&s=10"
  ];

  const IMG_SHALWAR = [
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4F_tpw5su4LSvaCem_lUfGJ5Bcxss6Wwf8Iwzgxw2Eg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2epvU9k8YZD8sGVdo5_A5XYcOs8WyTZoWcoQho14uVg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEmNk0lC3R6Erb3sAx_pLVqbqyKOq3f-zEy2OpHtrmNQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzYrwLsEedauaHvxuylonyp6LHB3S7jjD2k_-2rhVBHA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScl_8Mnbv4O0DbzhrkhGDDDH78q0wcKfFpcVuzf97yYQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTapo_MDyLf6SNu7Ewh8UZvHehg_wS9thTfbahpJUGWww&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsCthZ8iuFGIryZ4jFKRuYU90KVP10AUY4StqX3DslBw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwyEsecT8XccgHKI22ioKeG6h_q_JgsGX3lLYUpnxRw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNyYawPdGKk3gMwEqA2TZVpCdB-OT0SUQfq80XAllrvA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz5jX8ySMazT32ZzUuwEwKTkb3Xe_6jFNQtBLamuk0lw&s",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ076fEGYpD4eFSG48Mpqbn9beMNSVZaNTfggendYEflQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx1BIBjUyp0cFm6xVOoH1hVTtLamhTKWCvtKN3OEbTqg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRip5r9iF73mT3j1zwZ-TD7Tx1L41zesHBNBeOiWPyTdw&s",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSJug_zAp0wXQka5vm6rwS4JAMdDkYfjjzPhRPTNY3Ew&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN9MkMwa53TpxgKFc9ukI8EN_TfE8yoIBnaoqANYTVCA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-DcAcJoS61fv5wqm0cPwsDlUJUM0O7EOjzAOxOr4lAQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFUhDoF9xgWWp527IuMxE3Be088cvRAQOdwTIvws4-og&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RE94vVW6sjRzfPWxN83OJSPMusRcS3Yo9P_fwiLcGQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLlbgakP9bwrWNL5wbUbGLvw5EwcD04BfvkLuoZdb-Sw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVZACyeP4nIlTMJ8bgFAUdh4xiArrW9-COVNeAujOHJA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFTiEXdYeRcpaUJ4djdTOQyIaaxMm6SSH_K0_0FDMdiQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSteOM-CauxBkTZeBMK6QaBkF-alLXh6901HPaGBTdUaA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgRAwV0RyGeoXDc_fVzbFDd5bv4_nNWJEta8zg9sIMlQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC4RMX9J1CWmplrFhOoyNLZkCjzO8QeYy-U1O2roNI-w&s",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP8KLwQGc3eADPL5qhb1bM8XBPK_NkjgDAgKbVAbFHNQ&s=10"
  ];

  const IMG_CHADOR = [
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqGSxj-i4BzdQHInyKt-M2t2gMj2JNCCKH79vTll59hg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkMP62YTnOFA7q5qy3Z6huJj8uJzzWEA8NquS_2zOqsQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUe6_ytWB5Jx1WjgfwMwVNoe3VZJ1UXAwpJ6hE5qr_0w&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWgcNjO0uuu3H68wefUvrnZwuat3sd0Bu7azkEW5w7VA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRsxiGz9AxwngC0IBdhfTeOalgydLjX_H1cVnFLf3uVw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcyT0FePh6ZCJbUNN7L_au32YJjtFPEu-t8nVMrV7y_w&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDSPAFd5ZkO2xUJbSHuiEI3JH8oM1MfyeW6Iq-cD8BSQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx9Xmva4uPh3ciWp0VaIFOj-911B-zLGgs0ak83zqkDg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9gGK3h2uN9JuU-FMGS9V2pe9o9nZ4wm0szfD4AV99rQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPDoOiHmfoTVOEj6mN_MAU8E-nAa_5XtISuq5Ub0fXg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4rdV6soYk7QTeH4CfhSLPd5bxbwXP6dOtCc848bnjHg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9V1xrT_QIS4v3_W7y4LDhL5O3PSY83VC8_tM6Y_qGoA&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFwRWiZrMVl8CdSPi46AlDDjh1FalVeI85go-BNlWUwQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdsMQt6C2rz_GurcRPF1HaLeidXPRcxOO2517J9g3Nxg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNHrz5tKYIZGj-WPgBf_C6emvNbyIBL66LDfG5V0HdDQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeFi0z3FZuAdqBxHwpLtG6VjgEq_qIOTMt4UZK1oHDNQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP4S6x-dNk9PTrk8zX-dBQaZlaI0PJStve0K4Dt9J68w&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYpbMwEO4jFYH63fBE-0wy8JfmovBfFWpMLnrQklEQzw&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO5yDckpFP9Gj_kncwNKvoPYXTqLI9L9_Gop8XN40U5A&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl0Yj-AZ2uphucnpRmFhVnJ3EttaPhrzFyQUyJSX2CnQ&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvqJylHE_2wU-6pChNrtOsZC7iaqC7lMBRmYF5cv6P6Q&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPaJa4hyLUo9MDBLU2dRktEazWJ1nbIonhAwDDIG39Ew&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0uqnlwZfTgk-IuCyCaw4_-ZFjx1SQNc8RWt7Kyy-hXg&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXYH_snN7FDzaHDoBxxTOOVur8Jc1gYm4zUk2PwTccow&s=10",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9PgBbvNeG7zxundQY_Ds0pNqcxmgXWnzwYC6el3Z6VA&s=10"
  ];

  // ---------------------------------------------------------------------
  // بازه‌های قیمتِ ثابت (افغانی) — اعداد گرد، بدون رقم اعشار/روپیه‌ای
  // ---------------------------------------------------------------------
  const PRICES_MANTO   = [750,850,990,1150,1280,1350,1490,1650,1780,1990,720,890,1020,1190,1320,1420,1560,1690,1850,1950,780,950,1080,1240,1300];
  const PRICES_MAJLESI = [1350,1490,1650,1780,1990,2150,2350,2490,2650,2850,2990,3150,3350,3490,3650,3850,3990,4150,4290,4450,1450,1590,1890,2050,2250];
  const PRICES_KHANEGI = [450,490,550,590,650,690,750,790,850,890,950,990,1050,1090,1150,1190,470,530,610,670,730,810,870,930,1010];
  const PRICES_SHALWAR = [380,420,450,490,520,550,580,610,650,680,710,740,770,800,830,860,890,400,440,480,530,570,620,660,700];
  const PRICES_CHADOR  = [550,620,690,750,820,890,950,1020,1090,1150,1220,1290,1350,1420,1490,1550,1620,1690,1750,580,720,860,980,1180,1350];

  return {
    categories: [
      { id: 'manto',   name: 'مانتو',            icon: 'sparkle',  products: withPrices(IMG_MANTO,   PRICES_MANTO) },
      { id: 'majlesi',  name: 'لباس‌های مجلسی',   icon: 'gem',      products: withPrices(IMG_MAJLESI, PRICES_MAJLESI) },
      { id: 'khanegi',  name: 'لباس‌های خانه‌گی', icon: 'home',     products: withPrices(IMG_KHANEGI, PRICES_KHANEGI) },
      { id: 'shalwar',  name: 'شلوار',            icon: 'line',     products: withPrices(IMG_SHALWAR, PRICES_SHALWAR) },
      { id: 'chador',   name: 'چادر',             icon: 'wave',     products: withPrices(IMG_CHADOR,  PRICES_CHADOR) },
      { id: 'kotshalwar', name: 'کت شلوار',       icon: 'suit',     products: [] } // تصویری برای این دسته ارسال نشده — از پنل مدیر افزوده شود
    ]
  };
})();
