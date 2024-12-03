
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
        console.log("מייל נשלח בהצלחה.");
            } else {
              console.log("שגיאה בשליחת המייל.");
            }
    } catch (error) {
      console.error("שגיאה:", error);
    }
  };
  export default SendMail;