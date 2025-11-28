# Avatar-System-v1
✨ The Best Avatar System for Discord — simple, customizable, and powerful.

## 🚀 Features / الميزات

📌 Easily send profile avatars and banners / إرسال صور البروفايل والبنرات بسهولة

🎨 Support for custom HEX colors / دعم ألوان HEX مخصصة

🛠️ Flexible and customizable commands / إعداد أوامر مرنة وقابلة للتعديل

📂 Store profile images in a dedicated channel / تخزين صور البروفايل في روم مخصص

📝 Logging system to track sent images / نظام لوق لتتبع الصور المرسلة
- 

## 📸 Preview / معاينة الصور

🖼️  Panel Control / لوحة التحكم
![Avatar Panel Control](https://i.postimg.cc/vmsJSkQh/Screenshot-Chrome.png)
![Avatar Paneel Control](https://i.postimg.cc/htTFscqh/Screenshot-Chrome-1.png)
## 🖼️ Download Avatar & Banner & Proflie 
![Proflie Download](https://i.postimg.cc/1zrkxBXQ/Screenshot-Chrome-2.png)
![Proflie Download](https://i.postimg.cc/3RrP3G0D/Screenshot-Chrome-3.png)

 ## 🎮 Commands / الأوامر

| Command / الأمر       | Description / الوصف                                 |
|----------------------|---------------------------------------------------|
| `+send-proflie`       | Send avatar with HEX colors / إرسال صورة الأفاتار مع الألوان |
| `+send-image`         | Send banner or image / إرسال صورة أو بانر          |
| `+panel-contorl`      | send profile panel control / إرسال لوحة التحكم  |
| `+ads-phrase`          | Add new phrases / إضافة عبارة جديدة |


## 🏆 Credits
- 👨‍💻 Developed by **Velrosy**
- 💡 Designed for easy use & full customization
- 📦 Uses `discord.js` v14 and other npm packages
- contact Me If You Need Help (velrosy) ⬅️ Discord User

[![License](https://img.shields.io/badge/License-Custom-red)](LICENSE.md)

### 📂 إعدادات الغرف / Rooms Configuration

**العربية:**
لتشغيل البوت بشكل صحيح، يجب على المستخدم **تغيير أيدي الرومات (Channel IDs)** فقط لتتناسب مع سيرفرك.
⚠️ لا تغير قيمة **label** أو **type**، فهي مهمة لعمل البوت بشكل صحيح.

**English:**
To run the bot correctly, users should **only replace the channel IDs** with their own server channels.
⚠️ Do **not** change the **label** or **type** values, as they are essential for the bot to function properly.

```javascript
const ROOM_DATA = {
  '123456789012345678': { label: 'Avatar Boys', type: 'أفتار' },
  '234567890123456789': { label: 'Avatar Girls', type: 'أفتار' },
  '345678901234567890': { label: 'Banner', type: 'بنر' },
  '456789012345678901': { label: 'Anime', type: 'أفتار أنمي' },
};
```

> ⚠️ ملاحظة / Note: تأكد أن البوت لديه صلاحية **إرسال الرسائل وإرفاق الملفات** في هذه الرومات.
> Make sure the bot has permissions to **send messages and attach files** in these channels.
>
> 





## ⚙️ Configuration
Edit the `config.json` file with your own settings:


```json
{
  "token": "Put_Your_Token_here",            // ضع التوكن هنا
  "PREFIX": "+",                             // غيره على راحتك 
  "VoiceChannel": "Put_Voice_Channel_Id_Here",                        // ايدي روم الفويس
  "PREfix": "+send-proflie",                 // أمر إرسال الافتارات
  "PROFILE_ROOM_ID": "Put_Profile_channel_id", // روم إرسال الافتارات
  "PREFIx": "+send-image",                   // أمر إرسال الافتارات والبنرات
  "LOG_CHANNEL_ID": "Put_Log_Channel_Id_Here"                       // روم اللوق لتحميل الصور
}

