import React from 'react';
import { Layout, Typography, Button, Row, Col, Form, Input } from 'antd';
// import './LandingPage.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const LandingPage = () => {
  const onFinish = (values) => {
    console.log('Contact Form Submitted:', values);
    // כאן תוכל להוסיף לוגיקה לשליחת הטופס לשרת
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header-animation">
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
בדרך הישר        </Title>
      </Header>
      <Content style={{ background: '#f0f2f5', padding: '50px 20px' }}>
        {/* אזור ברוכים הבאים */}
        <Row justify="center" align="middle" gutter={[16, 16]} style={{ marginBottom: '50px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={2} className="fade-in">ברוכים הבאים!</Title>
            <Paragraph>
              אנו מספקים שירותי הסעות מתקדמים ומותאמים אישית. הצטרפו אלינו ותיהנו מניהול קל ונוח!
            </Paragraph>
          </Col>
         
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => window.location.href = '/login'}
              style={{ marginTop: '20px' }}
            >
              כניסה למשתמשים רשומים
            </Button>
          </Col>
        </Row>

        {/* אזור צור קשר */}
        <div id="contact-section" style={{ padding: '50px 0' }}>
          <Row justify="center" align="middle">
            <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Title level={2} className="fade-in">צור קשר</Title>
              <Paragraph>נשמח לשמוע ממך! השאר פרטים ואנו נחזור אליך בהקדם.</Paragraph>
            </Col>
            <Col span={12} xs={24} sm={18} lg={12}>
              <Form
                name="contact-form"
                layout="vertical"
                onFinish={onFinish}
                className="form-animation"
              >
                <Form.Item
                  label="שם מלא"
                  name="name"
                  rules={[{ required: true, message: 'אנא הזן את שמך המלא.' }]}
                >
                  <Input placeholder="הזן את שמך" />
                </Form.Item>
                <Form.Item
                  label="אימייל"
                  name="email"
                  rules={[
                    { required: true, message: 'אנא הזן את כתובת האימייל שלך.' },
                    { type: 'email', message: 'אנא הזן כתובת אימייל תקינה.' },
                  ]}
                >
                  <Input placeholder="name@example.com" />
                </Form.Item>
                <Form.Item
                  label="הודעה"
                  name="message"
                  rules={[{ required: true, message: 'אנא הזן את ההודעה שלך.' }]}
                >
                  <TextArea rows={4} placeholder="הזן את ההודעה שלך" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    שלח הודעה
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        חברת ההסעות ©2024
      </Footer>
    </Layout>
  );
};

export default LandingPage;
