import { useEffect, useState, useMemo } from "react";
import { addToCart, getAllProducts, getProductsByCategory } from "../../API";
import { Card, List, Image, Typography, Badge, Rate, Button, message, Spin, Select } from "antd";
import { useParams } from "react-router-dom";

function Products() {
    const [loading, setLoading] = useState(false);
    const param = useParams();
    const [items, setItems] = useState([]);
    const [sortOrder, setsortOrder] = useState('az');

    useEffect(() => {
        setLoading(true);
        (param?.categoryId ? getProductsByCategory(param.categoryId) : getAllProducts())
            .then(res => {
                setItems(res.products || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [param]);

    // useMemo prevents unnecessary re-sorting on every render
    const sortedItems = useMemo(() => {
        const data = [...items]; // Create a shallow copy
        return data.sort((a, b) => {
            const aloweredCaseTitle = a.title.toLowerCase()
            const bloweredCaseTitle = b.title.toLowerCase()

            if (sortOrder === "az") {
                return aloweredCaseTitle.localeCompare(bloweredCaseTitle);
            } else if (sortOrder === "za") {
                return bloweredCaseTitle.localeCompare(aloweredCaseTitle);
            } else if (sortOrder === "lowHigh") {
                return a.price - b.price;
            } else if (sortOrder === "highLow") {
                return b.price - a.price;
            }
            return 0;
        });
    }, [items, sortOrder]);

    // if (loading) {
    //     return <Spin spinning size="large" style={{ display: 'block', margin: '50px auto' }} />;
    // }

    return (
        <div className="productsContainer">
            <div style={{ marginBottom: 20 }}>
                <Typography.Text>View Items Sorted By: </Typography.Text>
                <Select
                    onChange={(value) => setsortOrder(value)} // Corrected prop name
                    value={sortOrder}
                    style={{ width: 200 }}
                    options={[
                        { label: 'Alphabetically A-Z', value: 'az' },
                        { label: 'Alphabetically Z-A', value: 'za' },
                        { label: 'Price Low to High', value: 'lowHigh' },
                        { label: 'Price High to Low', value: 'highLow' },
                    ]}
                />
            </div>
            <List
            loading={loading}
                grid={{ gutter: 16, column: 3 }}
                dataSource={sortedItems}
                renderItem={(product) => (
                    <List.Item>
                        <Badge.Ribbon text={`${product.discountPercentage}% Off`} color="red">
                            <Card
                                className="itemCard"
                                title={product.title}
                                cover={<Image className="itemCardImage" src={product.thumbnail} alt={product.title} />}
                                actions={[
                                    <Rate allowHalf disabled defaultValue={product.rating} />,
                                    <AddToCartButton item={product} />
                                ]}
                            >
                                <Card.Meta
                                    title={
                                        <Typography.Paragraph>
                                            Price: ${product.price.toFixed(2)}{" "}
                                            <Typography.Text delete type="danger">
                                                ${(product.price + (product.price * product.discountPercentage / 100)).toFixed(2)}
                                            </Typography.Text>
                                        </Typography.Paragraph>
                                    }
                                    description={
                                        <Typography.Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                                            {product.description}
                                        </Typography.Paragraph>
                                    }
                                />
                            </Card>
                        </Badge.Ribbon>
                    </List.Item>
                )}
            />
        </div>
    );
}

function AddToCartButton({ item }) {
    const [loading, setLoading] = useState(false);
    const addProductToCart = () => {
        setLoading(true);
        addToCart(item.id).then(() => {
            message.success(`${item.title} has been added to cart`);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    return (
        <Button type="link" loading={loading} onClick={addProductToCart}>
            Add To Cart
        </Button>
    );
}

export default Products;