const SendMail = async (file, fileName, emailDetails) => {
  const { email, subject, body } = emailDetails;

  const formData = new FormData();
  formData.append("file", file, fileName);
  formData.append("email", email);
  formData.append("subject", subject);
  formData.append("body", body);

  try {
    const response = await fetch("http://localhost:3001/api/mail", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      return { success: true, message: "המייל נשלח בהצלחה" };
    } else {
      return { success: false, message: "שגיאה בשליחת המייל" };
    }
  } catch (error) {
    console.error("שגיאה:", error);
    return { success: false, message: "שגיאה בשליחת המייל", error };
  }
};

export default SendMail;