import React, {useState} from 'react';
import { InputNumber, Input, Button, Descriptions, AutoComplete, Layout, Menu, Breadcrumb, Slider, Row, Col, Divider, notification } from 'antd';
import './App.css';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import {saveAs} from 'file-saver';
import Modal from 'antd/lib/modal/Modal';
const {Header, Footer, Content, Sider} = Layout;


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const person_key_map = {
  0: {
    'sarcasm': 'sarcasm',
    'metaphor': 'metaphor',
    'exaggeration': 'exaggeration',
    'homophonic': 'homophonic',
    'other_subtext': 'other_subtext',
    'sentiment': 'sentiment',
    'emotion': 'emotion'
  },
  1: {
    'sarcasm': 'sarcasm_x',
    'metaphor': 'metaphor_x',
    'exaggeration': 'exaggeration_x',
    'homophonic': 'homophonic_x',
    'other_subtext': 'other_subtext_x',
    'sentiment': 'sentiment_x',
    'emotion': 'emotion_x'
  },
  2: {
    'sarcasm': 'sarcasm_y',
    'metaphor': 'metaphor_y',
    'exaggeration': 'exaggeration_y',
    'homophonic': 'homophonic_y',
    'other_subtext': 'other_subtext_y',
    'sentiment': 'sentiment_y',
    'emotion': 'emotion_y'
  },
  3: {
    'sarcasm': 'sarcasm_checked',
    'metaphor': 'metaphor_checked',
    'exaggeration': 'exaggeration_checked',
    'homophonic': 'homophonic_checked',
    'other_subtext': 'other_subtext_checked',
    'sentiment': 'sentiment_checked',
    'emotion': 'emotion_checked'
  }
};
const person_map = {
  "1": 0,
  "2": 1,
  "3": 2
};
class App extends React.Component {
  state = {
    collapsed: false,
    data: [{'comment': '没有数据', 'content': '请先打开数据文件'}],
    number: 0,
    person: 0,
    options_map: []
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  onNumberChange = (value) => {
    const {data} = this.state;
    let options_map = {
      'sarcasm': [],
      'metaphor': [],
      'exaggeration': [],
      'homophonic': [],
      'other_subtext': [],
      'sentiment': [],
      'emotion': []
    };
    const content = data[value];
    for (let key in options_map) {
      let set = new Set();
      set.add(content[person_key_map[0][key]]);
      set.add(content[person_key_map[1][key]]);
      set.add(content[person_key_map[2][key]]);
      set.forEach((value, value1, s)=>{
        options_map[key].push({value: `${value}`});
      });
    }
    
    this.setState({number : value, options_map});

  }
  onNextChange = () => {
    let {number, data} = this.state;
    let options_map = {
      'sarcasm': [],
      'metaphor': [],
      'exaggeration': [],
      'homophonic': [],
      'other_subtext': [],
      'sentiment': [],
      'emotion': []
    };
    for (let key in options_map) {
      if (!data[number][person_key_map[3][key]]) {
        console.log(data[number][key])
        notification.error({
          message: '标注错误',
          description:
            `${key} 还未标注。`,
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
        return;
      }
    }
    number = number + 1;
    const content = data[number];
    for (let key in options_map) {
      let set = new Set();
      set.add(content[person_key_map[0][key]]);
      set.add(content[person_key_map[1][key]]);
      set.add(content[person_key_map[2][key]]);
      set.forEach((value, value1, s)=>{
        options_map[key].push({value: `${value}`});
      });
    }
    
    this.setState({number, options_map});
  }
  onLastChange = () => {
    let {number, data} = this.state;
    number = number - 1;
    let options_map = {
      'sarcasm': [],
      'metaphor': [],
      'exaggeration': [],
      'homophonic': [],
      'other_subtext': [],
      'sentiment': [],
      'emotion': []
    };
    const content = data[number];
    for (let key in options_map) {
      let set = new Set();
      set.add(content[person_key_map[0][key]]);
      set.add(content[person_key_map[1][key]]);
      set.add(content[person_key_map[2][key]]);
      set.forEach((value, value1, s)=>{
        options_map[key].push({value: `${value}`});
      });
    }
    
    this.setState({number, options_map});
  }
  onContentChange = (value, key) => {
    let {data, number} = this.state;
    data[number][person_key_map[3][key]] = value;
    this.setState({data});
  }
  onSave = () => {
    const {data} = this.state;
    const blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, 'new_file.json');
  }
  updateData = (data) => {
    data = JSON.parse(data.valueOf());
    data = JSON.parse(data);
    let {number} = this.state;
    let options_map = {
      'sarcasm': [],
      'metaphor': [],
      'exaggeration': [],
      'homophonic': [],
      'other_subtext': [],
      'sentiment': [],
      'emotion': []
    };
    const content = data[number];
    for (let key in options_map) {
      let set = new Set();
      set.add(content[person_key_map[0][key]]);
      set.add(content[person_key_map[1][key]]);
      set.add(content[person_key_map[2][key]]);
      set.forEach((value, value1, s)=>{
        options_map[key].push({value: `${value}`});
      });
    }
    this.setState({data, options_map});
  }
  onOpen = ({target: {files}}) => {
    const filereader = new FileReader();
    filereader.readAsText(files[0])
    filereader.onload = () => {
      this.updateData(filereader.result);
    };
  }
  onChooseLabeler = ({ item, key, keyPath, domEvent }) => {
    this.setState({person: person_map[key]});
  }
  render() {
    const {data, number, person, options_map} = this.state;
    const content = data[number];
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.onChooseLabeler}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              Label 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              Label 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              Label 3
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <div style={{width: 300}}>
              <Input color='white' type='file' accept={['.json']} bordered={false} onChange={this.onOpen}/>
              {/* <Button onClick={this.onOpen}>打开文件</Button> */}
              <br /> <br />
              第 &nbsp; <InputNumber min={0} max={555} value={number} onChange={this.onNumberChange} /> &nbsp; 条数据
            </div>
            <Descriptions title="Label Content">
              <Descriptions.Item label="Comment">{content['comment']}</Descriptions.Item>
              <Descriptions.Item label="Content">{content['content']}</Descriptions.Item>
            </Descriptions>
            <Divider></Divider>
            <Row>
            <Col span={1}>
            Class
            </Col>
            <Col span={8} offset={1}>
              Labeled
            </Col>
            <Col span={8} offset={1 }>
              Checked
            </Col>
            </Row>
            <Row>
              <Col span={1}>Sarcasm</Col>
              <Col span={8} offset={1}>
                <Input placeholder="Sarcasm" value={content[person_key_map[person]['sarcasm']]} disabled/>
              </Col>
              <Col span={8} offset={1}>
              <AutoComplete
                value={content[person_key_map[3]['sarcasm']]}
                placeholder="Sarcasm"
                style={{width:"100%"}}
                options={options_map['sarcasm']}
                onChange={(value)=>this.onContentChange(value, 'sarcasm')}
              />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={1}>Metaphor</Col>
              <Col span={8} offset={1}>
                <Input placeholder="Metaphor" value={content[person_key_map[person]['metaphor']]} disabled/>
              </Col>
              <Col span={8} offset={1}>
              <AutoComplete
                value={content[person_key_map[3]['metaphor']]}
                placeholder="Metaphor"
                style={{width:"100%"}}
                options={options_map['metaphor']}
                onChange={(value)=>this.onContentChange(value, 'metaphor')}
              />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={1}>Exaggeration</Col>
              <Col span={8} offset={1}>
                <Input placeholder="Exaggeration" value={content[person_key_map[person]['exaggeration']]} disabled/>
              </Col>
              <Col span={8} offset={1}>
                <AutoComplete
                  value={content[person_key_map[3]['exaggeration']]}
                  placeholder="Exaggeration"
                  style={{width:"100%"}}
                  options={options_map['exaggeration']}
                  onChange={(value)=>this.onContentChange(value, 'exaggeration')}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={1}>Homophonic</Col>
              <Col span={8} offset={1}>
                <Input placeholder="Homophonic" value={content[person_key_map[person]['homophonic']]} disabled/>
              </Col>
              <Col span={8} offset={1}>
              <AutoComplete
                value={content[person_key_map[3]['homophonic']]}
                placeholder="Homophonic"
                style={{width:"100%"}}
                options={options_map['homophonic']}
                onChange={(value)=>this.onContentChange(value, 'homophonic')}
              />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={1}>Sentiment</Col>
              <Col span={8} offset={1}>
                <Input placeholder="Sentiment" value={content[person_key_map[person]['sentiment']]} disabled />
              </Col>
              <Col span={8} offset={1}>
              <AutoComplete
                value={content[person_key_map[3]['sentiment']]}
                placeholder="Sentiment"
                style={{width:"100%"}}
                options={options_map['sentiment']}
                onChange={(value)=>this.onContentChange(value, 'sentiment')}
              />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={1}>Emotions</Col>
              <Col span={8} offset={1}>
                <Input placeholder="Emotions" value={content[person_key_map[person]['emotion']]} disabled/>
              </Col>
              <Col span={8} offset={1}>
              <AutoComplete
                value={content[person_key_map[3]['emotion']]}
                placeholder="Emotion"
                style={{width:"100%"}}
                options={options_map['emotion']}
                onChange={(value)=>this.onContentChange(value, 'emotion')}
              />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={1}>Other Subtext</Col>
              <Col span={8} offset={1}>
                <Input placeholder="Other Subtext"  value={content[person_key_map[person]['other_subtext']]} disabled/>
              </Col>
              <Col span={8} offset={1}>
              <AutoComplete
                value={content[person_key_map[3]['other_subtext']]}
                style={{width:"100%"}}
                placeholder="other_subtext"
                options={options_map['other_subtext']}
                onChange={(value)=>this.onContentChange(value, 'other_subtext')}
              />
              </Col>
            </Row>
            <Row>
              <Col span={8} offset={5}>
                <Button onClick={this.onLastChange} disabled={number === 0}> 上一条 </Button>
              </Col>
              <Col span={8} offset={1}>
                <Button type='primary' onClick={this.onNextChange} disabled={number === data.length - 1}> 下一条 </Button>
              </Col>
              <Col span={2}>
                <Button type='danger' onClick={this.onSave}> 保存 </Button>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
