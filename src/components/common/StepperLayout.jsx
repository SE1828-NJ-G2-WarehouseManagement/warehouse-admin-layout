import { Button, Steps, theme } from "antd";

const StepperLayout = ({ steps, current }) => {
  const { token } = theme.useToken();
 
  const items = steps.map((item) => ({ key: item.title, title: item.title, icon: item.icon }));
  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    padding: 20,
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <>
      <Steps current={current} items={items} className="!text-2xl"/>
      <div style={contentStyle}>{steps[current].content}</div>
    </>
  );
};

export default StepperLayout;
