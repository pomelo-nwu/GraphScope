import { createUuid } from "@antv/gi-sdk/lib/process/common";
import { Button, Space, Table } from "antd";
import * as React from "react";

const GS_GRAPH_LISTS = [
  {
    name: "my-release",
    type: "GrootGraph",
    creation_time: "2023/03/02 10:17:49",
    schema: {
      vertices: [
        {
          label: "person",
          properties: [
            {
              name: "id",
              id: 1,
              type: "LONG",
              is_primary_key: true,
            },
            {
              name: "name",
              id: 2,
              type: "STRING",
              is_primary_key: false,
            },
            {
              name: "location",
              id: 3,
              type: "STRING",
              is_primary_key: false,
            },
          ],
        },
        {
          label: "software",
          properties: [
            {
              name: "id",
              id: 1,
              type: "LONG",
              is_primary_key: true,
            },
            {
              name: "name",
              id: 2,
              type: "STRING",
              is_primary_key: false,
            },
          ],
        },
      ],
      edges: [
        {
          label: "traverses",
          properties: [
            {
              name: "id",
              id: 1,
              type: "LONG",
              is_primary_key: false,
            },
          ],
          relations: [
            {
              src_label: "software",
              dst_label: "software",
            },
          ],
        },
        {
          label: "uses",
          properties: [
            {
              name: "id",
              id: 1,
              type: "LONG",
              is_primary_key: false,
            },
            {
              name: "skill",
              id: 4,
              type: "LONG",
              is_primary_key: false,
            },
          ],
          relations: [
            {
              src_label: "person",
              dst_label: "software",
            },
          ],
        },
        {
          label: "develops",
          properties: [
            {
              name: "id",
              id: 1,
              type: "LONG",
              is_primary_key: false,
            },
            {
              name: "since",
              id: 5,
              type: "LONG",
              is_primary_key: false,
            },
          ],
          relations: [
            {
              src_label: "person",
              dst_label: "software",
            },
          ],
        },
      ],
    },
    gremlin_interface: {
      gremlin_endpoint: "ws://11.166.91.225:31943/gremlin", //"https://gi-api.graphscope.app/gremlin",
      grpc_endpoint: "192.168.0.174:30430",
      username: "xxxxxxxx",
      password: "xxxxxxxx",
    },
    directed: true,
  },
];

const transSchemaDataFromGS = (schema) => {
  const nodes = schema.vertices.map((c) => {
    return {
      nodeType: c.label,
      nodeTypeKeyFromProperties: undefined,
      properties: c.properties.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.name]: curr.type,
        };
      }, {}),
    };
  });
  const edges = schema.edges.map((c) => {
    return {
      edgeType: c.label,
      edgeTypeKeyFromProperties: undefined,
      properties: c.properties.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.name]: curr.type,
        };
      }, {}),
    };
  });
  return { nodes, edges };
};

const trans = (record) => {
  const {
    type: GSType,
    gremlin_interface,
    schema,
    creation_time,
    directed,
    name,
  } = record;

  const { hostname, protocol } = window.location;
  const HTTP_SERVER_URL = `http://30.230.89.170:7001`;

  const schemaData = transSchemaDataFromGS(schema);
  const id = `ds_${createUuid()}`; //GI平台需要有个datasetId，这个ID需要提前随机生成
  const InfoForGraphInsight = {
    id,
    name,
    schemaData,
    engineId: "GraphScope",
    engineContext: {
      ...gremlin_interface,
      type: GSType, // 原先列表中的数据，都存在engineContext中
      directed,
      HTTP_SERVER_URL: HTTP_SERVER_URL, //GIHttpServer 地址，这个可以根据部署环境确定
    },
    gmtCreate: creation_time,
    onwer: "东泽", // 　如果GraphScope Console有用户权限体系的话，可以加上这个Owner
    size: "G(100,20)", //如果列表中有图的数据规模的话，可以加上，GI平台支持展示
  };
  const encodeInfo = encodeURIComponent(JSON.stringify(InfoForGraphInsight));
  const GI_DEPLOY_SITE = "http://30.230.89.170:8000/"; // window.location.origin
  window.open(
    `${GI_DEPLOY_SITE}/#/dataset/SYSTEM_DIRECT_CONNECT?datasetInfo=${encodeInfo}`
  );
};

const DatasetTable = () => {
  const handleAnalysis = async (record) => {
    trans(record);
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "创建时间",
      dataIndex: "creation_time",
      key: "creation_time",
    },
    {
      title: "操作",
      render: (record) => {
        return (
          <Space>
            <Button type="text" onClick={() => handleAnalysis(record)}>
              graphinsight
            </Button>
          </Space>
        );
      },
    },
  ];
  return <Table dataSource={GS_GRAPH_LISTS} columns={columns}></Table>;
};

export default DatasetTable;
