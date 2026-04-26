import { Typography } from "antd";

function AppFooter() {
  return <div className='appFooter'>
    <Typography.Link href="https://www.google.com" target='_blank'>Privacy Policy</Typography.Link>
    <Typography.Link href="https://www.google.com" target='_blank'>Terms & Conditions</Typography.Link>
    <Typography.Link href="https://www.google.com" target='_blank'>Return Policy</Typography.Link>
    <Typography.Link href="tel:+923359793502" target='_blank'>+923359793502</Typography.Link>

  </div>
}
export default AppFooter;