import {
  Page,
  LegacyCard,
  Text,
  DataTable,
  Layout,
  Spinner,
  EmptyState,
  Tag,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React from "react";
import { useAppQuery } from "../hooks";

export default function Products() {
  let rows = [];
  let rowMarkup = [];

  const {
    data: products,
    isLoading: isLoading,
    isError,
  } = useAppQuery({
    url: "/api/products/",
    reactQueryOptions: {
      onSuccess: () => {},
    },
  });

  const renderImage = (imageUrl) => (
    <img
      src={imageUrl}
      alt="Product Image"
      style={{
        width: "50px",
        height: "50px",
        objectFit: "cover",
      }}
    />
  );

  if (isLoading) {
    return (
      <Page fullWidth>
        <TitleBar title={"Product Catalog"} />
        <Layout>
          <Layout.Section>
            <ProductPublishCount />
          </Layout.Section>
          <Layout.Section>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Spinner accessibilityLabel="Spinner example" size="large" />
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page fullWidth>
        <TitleBar title={"Product Catalog"} />
        <Layout>
          <Layout.Section>
            <ProductPublishCount productLength={rows.length} />
          </Layout.Section>
          <Layout.Section>
            <LegacyCard>
              <p>Error loading products. Please try again.</p>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (products && products.data) {
    // Map data for DataTable rows
    rows = products.data.map(({ id, title, images, tags }, index) => ({
      id,
      title,
      image: images && images.length > 0 ? images[0].src : null,
      tags,
    }));

    // Map data for DataTable rowsMarkup
    rowMarkup = rows.map(({ id, title, image, tags }, index) => [
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text key={`${id}-combined`}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            {image && renderImage(image)}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ marginLeft: "8px", fontSize: "16px" }}>
                {title}
              </span>
              <span
                style={{ marginLeft: "8px", fontSize: "12px", color: "gray" }}
              >
                #{id}
              </span>
            </div>
          </div>
        </Text>
        <div>
          {tags !== "" &&
            tags.split(", ").map((tag) => (
              <>
                {" "}
                <Tag>{tag}</Tag>&nbsp;
              </>
            ))}
        </div>
      </div>,
    ]);
  }

  return (
    <Page fullWidth>
      <TitleBar title={"Product Catalog"} />

      <Layout>
        <Layout.Section>
          <ProductPublishCount productLength={rows.length ?? 0} />
        </Layout.Section>

        <Layout.Section>
          {rows.length === 0 ? (
            <Layout.Section>
              <LegacyCard sectioned>
                <EmptyState
                  heading="No Products Found"
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                ></EmptyState>
              </LegacyCard>
            </Layout.Section>
          ) : (
            <DataTable
              columnContentTypes={["text"]}
              headings={[<div style={{ fontWeight: "bold" }}>Products</div>]}
              rows={rowMarkup}
            />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function ProductPublishCount({ productLength }) {
  const rows = [["Total", productLength]];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 5,
        width: "200px",
      }}
    >
      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "numeric"]}
          headings={[
            <div style={{ fontWeight: "bold" }}>Status</div>,
            <div style={{ fontWeight: "bold" }}>Products</div>,
          ]}
          rows={rows}
        />
      </LegacyCard>
    </div>
  );
}
