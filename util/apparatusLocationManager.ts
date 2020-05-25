import { connect, MqttClient} from 'mqtt';

enum Mode {
  MQTT = 0,
  WS = 1
}

interface ApparatusLocation {
  // 工夹具实体标志， {defId}-{seqId}
  id: string,
  // 厂区
  factory: string,
  // 区域
  region: string,
  // 线别
  line: string,
  // 工站
  workstation: string
}

type Client = MqttClient | WebSocket

export default class ApparatusLocationManager {
  client: Client
  mode: Mode
  url: string
  callbacks: Array<(data: ApparatusLocation) => never>
  constructor(mode: Mode, url: string) {
    this.mode = mode
    this.url = url

    if(mode === Mode.MQTT) {
      this.client = connect(url);
      this.client.subscribe("apparatusLocationInfo");
      this.client.on('end', () => {
        (this.client as MqttClient).reconnect();
      })
    } else {
      this.client = new WebSocket(url);
      // 失活检测
      setInterval(() => {
        if ((this.client as WebSocket).readyState == (this.client as WebSocket).CLOSED) {
          this.client = new WebSocket(this.url);
          for (const callback of this.callbacks) {
            this.client.addEventListener('message', (ev) => {
              callback(ev.data);
            })
          }
        }
      }, 5000)
    }
  }

  /**
   * 添加数据回调函数，可以添加多个
   * @param cb 
   */
  addCallBack(cb: (data: ApparatusLocation) => never) {
    this.callbacks.push(cb);
    if(this.mode == Mode.WS) {
      (this.client as WebSocket).addEventListener('message', (ev) => {
        cb(ev.data);
      })
    } else {
      (this.client as MqttClient).on('message', (topic, payload) => {
        if (topic === 'apparatusLocationInfo') {
          cb(JSON.parse(payload.toString()));
        }
      })
    }
  }
}