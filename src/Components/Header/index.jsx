import {
  Badge,
  Drawer,
  InputNumber,
  Menu,
  Table,
  Typography,
  Button,
  Form,
  Input,
  Checkbox,
  message
} from "antd";
import { HomeFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCart } from "../../API";

function AppHeader() {
  const navigate = useNavigate();

  return (
    <div className="appHeader">
      <Menu
      className="appMenu"
        onClick={(item) => navigate(`/${item.key}`)}
        mode="horizontal"
        items={[
          { label: <HomeFilled />, key: "" },
          {
            label: "Men",
            key: "Men",
            children: [
              { label: "Men's Shirts", key: "mens-shirts" },
              { label: "Men's Watches", key: "mens-watches" },
              { label: "Men's Shoes", key: "mens-shoes" }
            ]
          },
          {
            label: "Women",
            key: "Women",
            children: [
              { label: "Women's Shoes", key: "womens-shoes" },
              { label: "Women's Watches", key: "womens-watches" },
              { label: "Women's Bags", key: "womens-bags" },
              { label: "Women's Jewellery", key: "womens-jewellery" }
            ]
          },
          { label: "Fragrances", key: "fragrances" }
        ]}
      />

      <Typography.Title level={4} style={{ margin: 0 }}>
        Test Store
      </Typography.Title>

      <AppCart />
    </div>
  );
}

function AppCart() {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCart().then((res) => {
      setCartItems(res.products || []);
    });
  }, []);

  const onConfirmOrder = (values) => {
    console.log("Order:", {
      customer: values,
      items: cartItems
    });

    setCartDrawerOpen(false);
    setCheckoutDrawerOpen(false);

    message.success("Your order has been placed successfully.");
  };

  return (
    <div>
      {/* Cart Icon */}
      <Badge
        count={cartItems.length}
        onClick={() => setCartDrawerOpen(true)}
        className="shoppingCartIcon"
      >
        <ShoppingCartOutlined style={{ fontSize: 20 }} />
      </Badge>

      {/* Cart Drawer */}
      <Drawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        title="Your Cart"
        width={450}
      >
        <Table
          rowKey="id"
          pagination={false}
          dataSource={cartItems}
          columns={[
            { title: "Title", dataIndex: "title" },
            {
              title: "Price",
              dataIndex: "price",
              render: (value) => `$${value}`
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              render: (value, record) => (
                <InputNumber
                  min={1}
                  value={value}
                  onChange={(val) => {
                    setCartItems((prev) =>
                      prev.map((item) =>
                        item.id === record.id
                          ? {
                              ...item,
                              quantity: val,
                              total: item.price * val
                            }
                          : item
                      )
                    );
                  }}
                />
              )
            },
            {
              title: "Total",
              dataIndex: "total",
              render: (value) => `$${value}`
            }
          ]}
          summary={(data) => {
            const total = data.reduce(
              (sum, item) => sum + item.total,
              0
            );
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3}>
                  <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <strong>${total}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />

        <Button
          type="primary"
          block
          style={{ marginTop: 16 }}
          onClick={() => setCheckoutDrawerOpen(true)}
        >
          Checkout Your Cart
        </Button>
      </Drawer>

      {/* Checkout Drawer */}
      <Drawer
        open={checkoutDrawerOpen}
        onClose={() => setCheckoutDrawerOpen(false)}
        title="Confirm Order"
      >
        <MyForm onConfirmOrder={onConfirmOrder} />
      </Drawer>
    </div>
  );
}

function MyForm({ onConfirmOrder }) {
  return (
    <Form layout="vertical" onFinish={onConfirmOrder}>
      <Form.Item
        label="Full Name"
        name="full_name"
        rules={[
          { required: true, message: "Full name is required" },
          { min: 3, message: "Name must be at least 3 characters" }
        ]}
      >
        <Input placeholder="Enter Name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Email is required" },
          { type: "email", message: "Enter a valid email" }
        ]}
      >
        <Input placeholder="Enter Email" />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[
          { required: true, message: "Address is required" },
          { min: 10, message: "Address must be at least 10 characters" }
        ]}
      >
        <Input.TextArea rows={3} placeholder="Enter address" />
      </Form.Item>

      <Form.Item>
        <Checkbox checked disabled>
          Cash On Delivery
        </Checkbox>
        <Typography.Paragraph type="secondary">
          More methods coming soon
        </Typography.Paragraph>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Confirm Order
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AppHeader;