/* 四个板块的攻略内容。
   TABS：板块顺序和名字。LEGS：两地之间的交通（自驾/大巴）。ROUTES：多日行程。GUIDE：每个地点的四个板块。

   GUIDE[地点id] = {transport:[…], route:[…], food:[…], hotel:[…]}，数组里可以放：
   - "普通文字"                        → 列表里的一条（支持 [[pid:…]] [[map:…]] [[link:…]] 标记）
   - "leg:a"                           → 插入 LEGS.a 的交通卡片
   - "route:smagto"                    → 插入 ROUTES.smagto 的行程时间线
   - "map:loopfwd" / "map:loop"        → 墨城—圣米格尔—瓜纳华托环线示意图（正向/反向）
   - {h:"小标题"}
   - {name, q, pid, r, n, price, note} → 餐厅/酒店/景点一行：名字链接 Google 地图、Google 评分、价格、网友建议
   - {src:"资料来源说明"}

   文字标记：
   [[pid:PLACE_ID|搜索词|显示文字]]   Google 地图链接（带 place_id，最准）
   [[map:搜索词|显示文字]]             Google 地图搜索链接
   [[link:https://…|显示文字]]         普通链接
   「Google 4.6 ★（13,079 条）」这样的文字会自动显示成琥珀色。 */
const TABS=[["transport","路线和交通"],["route","行程安排"],["food","餐厅美食"],["hotel","酒店推荐"]];

const LEGS={
 a:{title:"墨城（Ciudad de México） → 圣米格尔（San Miguel de Allende）",km:"约 270 公里",drive:"3.5–4 小时",driveNote:"走 57D 高速经克雷塔罗（Querétaro），早高峰出城多留 30–60 分钟。",bus:"3.5–4 小时",busNote:"墨城（Ciudad de México）北站 Terminal Central del Norte（地铁 5 号线 Autobuses del Norte 站）上车，ETN 或 Primera Plus。到圣米格尔（San Miguel de Allende）长途车站，离老城约 2 公里，打车进城。"},
 b:{title:"圣米格尔（San Miguel de Allende） → 瓜纳华托（Guanajuato）",km:"约 90 公里",drive:"约 1.5 小时",driveNote:"路程短，早上出发上午就能到。",bus:"约 1.5 小时",busNote:"直达班次不多（ETN、Primera Plus 有），提前在官网查；没有直达可经多洛雷斯伊达尔戈（Dolores Hidalgo）或克雷塔罗（Querétaro）转车。瓜纳华托（Guanajuato）车站在城外，打车进老城。"},
 c:{title:"瓜纳华托（Guanajuato） → 墨城（Ciudad de México）",km:"约 340 公里",drive:"4–4.5 小时",driveNote:"高速收费站合计大约 350–480 比索。",bus:"4.5–5.5 小时",busNote:"ETN 约 4.5–5 小时，Primera Plus 约 5–5.5 小时，到墨城（Ciudad de México）北站。"},
 d:{title:"墨城（Ciudad de México） ⇄ 巴耶德布拉沃（Valle de Bravo）",km:"约 135 公里",drive:"约 2–2.5 小时",driveNote:"Google 地图从墨城出发约 2 小时，经托卢卡（Toluca）方向，有收费路段；网友说单程高速费约 500 比索。圣周、跨年等假期车多，早点出发。镇里路上坑多、坡陡，要慢行。",bus:"约 2–2.5 小时",busNote:"墨城西站 Terminal Poniente（Observatorio）上车，网友说现场买票就行，基本每小时一班，有 Zina Bus、Exelencia Plus 等，车上有厕所；有网友说票价约 310 比索。到 Valle de Bravo 长途车站后，步行约 15 分钟下坡到湖边码头。网友提醒：回墨城的末班车约 19:00，出发前核实。"},
 e:{title:"墨城（Ciudad de México） → 瓦尔基里科（Val'Quirico）",km:"约 123 公里",drive:"约 2–2.5 小时",driveNote:"Google 地图从墨城出发约 2 小时，走墨城–普埃布拉高速（México–Puebla 150D），有收费站。导航搜 Val'Quirico，小镇入口正对面就是收费停车场；网友说平日约 50 比索、周末约 200 比索。",bus:"打车 / 小团",busNote:"小红书网友基本是自驾，笔记里没有写到墨城直达的大巴，出发前核实。也可以打车（Uber / DiDi 从墨城单程 2 小时以上，网友建议提前和司机谈好回程），或报一日游小团，很多团会连着普埃布拉（Puebla）、乔卢拉（Cholula）一起走。"},
 f:{title:"瓦尔基里科（Val'Quirico） → 乔卢拉（Cholula）",km:"约 20 公里",drive:"约 25 分钟",driveNote:"Google 地图从小镇开到乔卢拉大金字塔约 25 分钟。",bus:"打车",busNote:"有网友从乔卢拉打 DiDi 到小镇，约 40 分钟。"},
 g:{title:"乔卢拉（Cholula） → 普埃布拉（Puebla）",km:"约 12 公里",drive:"约 25 分钟",driveNote:"Google 地图从乔卢拉大金字塔开到普埃布拉大教堂约 25 分钟。两地挨着，傍晚看完日落过去吃晚饭正好。",bus:"打车",busNote:"距离很近，打车（Uber / DiDi）最方便。"},
 i:{title:"墨城（Ciudad de México） ⇄ 冷水湖（Las Estacas）",km:"约 131 公里",drive:"约 2–2.5 小时",driveNote:"Google 地图从墨城出发约 2 小时，走墨城–库埃纳瓦卡高速（Autopista del Sol 95D），有收费站；回程差不多。园区停车免费。网友建议早上 7–8 点出发，避开堵车和周末人多。",bus:"约 2 小时 + 打车",busNote:"网友的走法：坐地铁到 Tasqueña 站，在旁边的墨城南站（Terminal Central del Sur）坐大巴到 Yautepec 镇（约 200 比索），再打车去园区。回程园区叫不到 Uber，要请工作人员帮忙叫出租车，网友打车回 Yautepec 花了 370 比索；网友说 Yautepec 晚上 10 点还有回墨城的大巴，出发前核实。"},
 j:{title:"酒店 → 国家人类学博物馆（Museo Nacional de Antropología）",km:"约 5.6 公里",drive:"约 16–20 分钟",driveNote:"Google 地图从 Polanco 一带走改革大道（Paseo de la Reforma）约 16–20 分钟（酒店位置不同会有出入）。官网：博物馆停车场 24 小时开放，每小时 50 比索（2026 年 10 月查询）。网友说打 Uber 直接定位博物馆就行。",bus:"约 35 分钟",busNote:"Google 地图坐公交约 35 分钟。官网写的最近站点：Metrobús 7 号线 Antropología 站，地铁 7 号线 Auditorio 站、1 号线 Chapultepec 站，地铁站离博物馆约 1.3 公里；网友说 Auditorio 站出来走 10 分钟左右。"},
 k:{title:"墨城（Ciudad de México） ⇄ 特奥蒂瓦坎（Teotihuacán）",km:"约 55 公里",drive:"约 1 小时 15 分钟",driveNote:"Google 地图从墨城出发约 1 小时 15 分钟，走墨城–Pirámides 方向高速，有收费站（网友打 Uber 交了约 110 比索过路费）。网友建议导航到 3 号门停车场（Estacionamiento Puerta 3），网友说停车每辆约 63 比索。",bus:"约 1 小时",busNote:"网友的走法：坐地铁到墨城北站（Terminal Central del Norte，地铁 5 号线 Autobuses del Norte 站），进大厅往左找 8 号门附近 Autobuses Teotihuacan 的柜台，说去「Pirámides」，网友付过单程约 81 比索、往返约 162–182 比索，大约每 15 分钟一班。一般在 2 号门下车，也可以跟司机说在 3 号门下。回程在 2 号门外路边等车，网友说末班车大约 17–18 点。"},
 l:{title:"酒店 → 宪法广场（Zócalo）",km:"约 9.6 公里",drive:"约 35 分钟",driveNote:"Google 地图从 Polanco 一带出发约 35 分钟（酒店位置不同会有出入）。网友说老城里景点挨在一起，到了以后全程步行就行。",bus:"约 36 分钟",busNote:"Google 地图坐公共交通约 36 分钟。"},
 m:{title:"酒店 → 蓝房子（Casa Azul · Museo Frida Kahlo）",km:"约 14.5 公里",drive:"约 35–45 分钟",driveNote:"Google 地图从 Polanco 一带出发约 36–43 分钟（酒店位置不同会有出入），常堵车。官网说博物馆没有停车场。",bus:"约 1 小时 10 分钟",busNote:"Google 地图坐公共交通约 1 小时 10 分钟，需要换乘。"},
 n:{title:"酒店 → 瓦斯孔塞洛斯图书馆（Biblioteca Vasconcelos）",km:"约 7.8 公里",drive:"约 25 分钟",driveNote:"Google 地图从 Polanco 一带出发约 25 分钟（酒店位置不同会有出入）。网友说打 Uber 或滴滴直接搜「Biblioteca Vasconcelos」。",bus:"约 35 分钟",busNote:"Google 地图坐公共交通约 34 分钟（约 7 比索）。墨城旅游局网站写最近的是地铁 Buenavista 站，约 210 米。"},
 p:{title:"坎昆（Cancún） → 普拉亚德尔卡门（Playa del Carmen）",km:"约 74 公里",drive:"约 1 小时 10 分钟",driveNote:"Google 地图从坎昆酒店区出发约 1 小时 8 分钟。网友说坎昆—图卢姆—奇琴伊察一路没有收费站，路况较好。",bus:"约 1 小时",busNote:"网友推荐当地小巴 colectivo：在坎昆市区的 colectivo 车站上车，一人约 55 比索，跟司机说下车地点，下车再付钱；比 ADO 大巴便宜，还能放行李。也可以坐 ADO 大巴。"},
 q:{title:"普拉亚德尔卡门（Playa del Carmen） → 图卢姆（Tulum）",km:"约 64 公里",drive:"约 55 分钟",driveNote:"Google 地图约 54 分钟。图卢姆镇上单行道多，开慢点；路边停车难，海边停车场网友说要 100–250 比索。",bus:"约 1 小时",busNote:"网友说坐 colectivo 一人约 60 比索，到普拉亚后换乘去图卢姆的线路（站点在 Playa del Carmen 市区，走几十米就到）。也可以坐 ADO 大巴。"},
 r:{title:"图卢姆（Tulum） ⇄ 奇琴伊察（Chichén Itzá）",km:"约 152 公里",drive:"约 2 小时 12 分钟",driveNote:"Google 地图从图卢姆镇中心出发单程约 2 小时 12 分钟（2026 年 11 月）。尤卡坦州比金塔纳罗奥州慢 1 小时，算好时间。网友提醒：快到景区时有很多人穿工作服拦车卖票、指路去私人停车场，都别停；开到最里面的官方停车场 Parador Turístico，网友付过 120 比索，只收现金。后排也要系安全带，警察会查。",bus:"一日团",busNote:"网友多是自驾或报一日团。坎昆超市门口的旅行社一日团网友付过 50–70 美元，含两个天然井、奇琴伊察和自助午餐，早上 7 点出发、晚上七八点回。"},
 s:{title:"图卢姆（Tulum） → 巴卡拉尔（Bacalar）",km:"约 216 公里",drive:"约 2.5 小时",driveNote:"Google 地图约 2 小时 33 分钟。沿途信号差，提前下载离线地图、加满油；加油时盯着表、尽量刷卡。",bus:"出发前核实",busNote:"小红书笔记里没有写到这一段的大巴，出发前查 ADO 班次。"},
 t:{title:"巴卡拉尔（Bacalar） → 切图马尔机场（Aeropuerto de Chetumal）",km:"约 39 公里",drive:"约 40 分钟",driveNote:"Google 地图约 38 分钟。",bus:"拼车 / 打车",busNote:"网友说机场门口有拼车小巴（colectivo），一人约 200–250 比索，依次送到各家酒店；包车约 500–700 比索。机场叫不到 Uber。回程可以先问酒店怎么约拼车。"},
 fl:{title:"墨城（Ciudad de México） ✈ 坎昆（Cancún）",km:"飞行约 2.5 小时",m1:"飞机",drive:"约 2.5 小时",driveNote:"墨城飞坎昆约 2.5 小时。走 9 天路线的话，回程从切图马尔（Chetumal）飞回墨城，网友说 2–3 小时。",m2:"机场 → 酒店区",bus:"约 33 分钟",busNote:"Google 地图约 33 分钟（25 公里）。网友多是坐酒店的接驳车；机场出来右手边有 ADO 售票点，坐大巴去酒店区、市区更便宜。网友提醒机场门口拉客的多，不要跟主动搭话的人走。"},
 bf:{title:"墨城（Ciudad de México） ✈ 切图马尔（Chetumal）",km:"飞行约 2 小时",m1:"飞机",drive:"约 2 小时",driveNote:"网友说墨城飞切图马尔约 2 小时，下飞机再去巴卡拉尔约 40 分钟（看下一张卡片）。航班和票价以航空公司为准。",m2:"大巴",bus:"出发前核实",busNote:"小红书笔记里网友都是坐飞机，没有写到墨城直达巴卡拉尔的大巴；想坐大巴的话，出发前在 ado.com.mx 查。"},
 u:{title:"坎昆机场（Aeropuerto de Cancún） → 图卢姆（Tulum）",km:"约 119 公里",drive:"约 1 小时 25 分钟",driveNote:"Google 地图到图卢姆镇中心约 1 小时 25 分钟，网友说这一路没有收费站；图卢姆一带土路多，网友建议租 SUV。",bus:"约 1.5 小时",busNote:"网友说机场出来右手边就有 ADO 售票点，可以直接坐到普拉亚德尔卡门、图卢姆；Google 地图坐公共交通约 1 小时 36 分钟。网友提醒机场门口拉客的多，不要跟主动搭话的人走。班次和票价以 ado.com.mx 为准。"},
 v:{title:"图卢姆（Tulum） → 普拉亚德尔卡门（Playa del Carmen）",km:"约 64 公里",drive:"约 50 分钟",driveNote:"Google 地图从图卢姆镇中心出发约 50 分钟（2026 年 11 月）。",bus:"约 1 小时",busNote:"网友坐 colectivo 小巴，一人约 60 比索，在图卢姆市区的 colectivo 站上车，或在 307 公路边招手；下车再付现金。也可以坐 ADO 大巴。"},
 x:{title:"普拉亚德尔卡门（Playa del Carmen） → 坎昆机场",km:"约 53 公里",drive:"约 40 分钟",driveNote:"Google 地图约 38–39 分钟。还车、值机留足时间。",m2:"大巴 / 打车",bus:"约 1 小时",busNote:"ADO 大巴直达机场，网友三个人付过 650–810 比索。网友说 2026 年 10 月起普拉亚可以叫 Uber（接单的是出租车），到坎昆机场约 500 比索；酒店包车网友问到 1,900 比索。"},
 y:{title:"坎昆（Cancún） → 女人岛（Isla Mujeres）",km:"船程约 30 分钟",m1:"市区码头 Puerto Juárez",drive:"班次最多",driveNote:"[[pid:ChIJr1YJFpYuTI8R5Dj3LVxBntg|Ultramar Puerto Juárez|Ultramar Puerto Juárez 码头]]（Google 4.5 ★（12,325 条））。从酒店区打车过去 Google 地图约 16 分钟；网友说码头停车一天约 150 比索。",m2:"酒店区码头",bus:"一天约 7 班",busNote:"Playa Tortugas、Playa Caracol 两个码头在酒店区，住附近的话不用去市区，但班次少，先查时刻表。"},
 z:{title:"普拉亚德尔卡门（Playa del Carmen） ⇄ 科苏梅尔（Cozumel）",km:"船程约 45 分钟",m1:"Ultramar 渡轮",drive:"约 45 分钟",driveNote:"从普拉亚市中心海边的[[map:Terminal Marítima Playa del Carmen|普拉亚渡轮码头]]出发，到岛上的科苏梅尔海运码头（Terminal Marítima de Cozumel）。白天才有船。",m2:"其他船 / 车渡",bus:"—",busNote:"码头也有 Winjet 等其他船公司。想把车开上岛，要去普拉亚以南的 Calica 码头坐车渡。"},
 aa:{title:"坎昆酒店区 ⇄ 奇琴伊察（Chichén Itzá）",km:"约 220 公里",drive:"约 2.5–2.7 小时",driveNote:"Google 地图从坎昆酒店区出发单程约 2 小时 33–40 分钟（2026 年 11 月）。网友包车：早上 7 点从酒店出发，约 9:10 到金字塔，9:30 以后人陡然增多，几个人平摊下来和好一点的团差不多。",bus:"约 4.5 小时",busNote:"网友坐 Oriente 大巴：在坎昆市区 [[map:ADO Terminal Centro Cancún|ADO 市区汽车站（Terminal Centro）]] ADO 柜台左边的小窗口买票，单程 300 比索，可以刷卡，只卖单程，基本一小时一班，直接到景区门口。车上没厕所、空调很冷，途中在巴利亚多利德（Valladolid）停。回程在景区门口找挂 Oriente 牌子的人买票，只收现金（2026 年 5 月）。"},
 ab:{title:"坎昆酒店区 ⇄ Xcaret",km:"约 82 公里",drive:"约 1 小时 7 分钟",driveNote:"Google 地图从坎昆酒店区出发约 1 小时 7 分钟（2026 年 11 月）。",m2:"乐园接送 / 跟团",bus:"约 1–1.5 小时",busNote:"网友说买门票时可以加买乐园的往返交通票（约三十几美元）；也有网友在酒店的旅行社订「门票 + 午餐 + 接送」套餐，比官网便宜一点，早上 7 点左右接，不看晚上的秀下午 3:30 左右回，看秀的话 9 点散场后送回酒店。"},
 ac:{title:"图卢姆（Tulum） ⇄ Xcaret",km:"约 57 公里",drive:"约 45 分钟",driveNote:"Google 地图从图卢姆镇中心出发约 43–44 分钟（2026 年 11 月）。",m2:"colectivo / 打车",bus:"约 1 小时",busNote:"网友坐 colectivo 小巴，说「Xcaret」，在 307 公路边乐园的摆渡车站下车（普拉亚上车 35 比索），再坐乐园的免费摆渡车进园；乐园官网写摆渡车 8:30–22:00 每半小时一班（网友转述）。回程在乐园公交站尽头的 F 站牌坐摆渡车回公路边，再拦 colectivo，只收比索现金。"},
 ad:{title:"图卢姆镇 ⇄ 大天然井（Gran Cenote）",km:"约 4.3 公里",drive:"约 7 分钟",driveNote:"Google 地图开车约 7 分钟，在去科巴（Cobá）的路上。",m2:"骑车 / 打车",bus:"约 14 分钟",busNote:"Google 地图骑车约 14 分钟；也可以打出租车（网友说图卢姆基本叫不到 Uber、DiDi）。"},
 ae:{title:"图卢姆镇 ⇄ 双眼天然井（Dos Ojos）",km:"约 21 公里",drive:"约 27 分钟",driveNote:"Google 地图开车约 26–27 分钟，在坎昆—图卢姆联邦公路（307 公路）124 公里处。",m2:"colectivo",bus:"约 30–40 分钟",busNote:"网友说从图卢姆坐 colectivo 约 40 比索，跟司机说在 Dos Ojos 路口下车；网友说 307 公路边可以招手上下车；园区里天然井之间坐园区的车 50 比索。"},
 ag:{title:"切图马尔机场（Aeropuerto de Chetumal） → 巴卡拉尔（Bacalar）",km:"约 39 公里",drive:"约 40 分钟",driveNote:"Google 地图约 38 分钟。网友从机场打 DiDi 约 250 比索、30 分钟；酒店接送网友付过约 200–280 元人民币。",m2:"拼车 / 火车",bus:"约 40 分钟",busNote:"网友说机场门口有拼车小巴（colectivo），一人约 200 比索，依次送到各家酒店。机场对面就是玛雅火车（Tren Maya）切图马尔站，坐到巴卡拉尔约 40 分钟。回机场记得先问酒店怎么约拼车，不然打车网友付过 500–600 比索。"},
 h:{title:"普埃布拉（Puebla） → 墨城（Ciudad de México）",km:"约 142 公里",drive:"约 2.5 小时",driveNote:"Google 地图从普埃布拉大教堂开回墨城 约 2 小时 25 分钟，走 150D 高速，有收费站。",bus:"约 2.5 小时",busNote:"有直达大巴。e-bus：普埃布拉在 Paseo Destino 总站上车，墨城的下车点有 Miyana Polanco、Terrapuerto El Ángel（改革大道天使像）等，住 Polanco 一带最方便。也可以坐 ADO 或 Estrella Roja 到墨城东站 TAPO。路线网站估计票价约 260–500 比索，班次和票价以 ebus.mx、ado.com.mx、estrellaroja.com.mx 为准。"}
};

/* 「路线和交通」里的路线示意图，攻略里写 "map:<key>"。
   pad：[左, 右, 下, 上] 四边留白（经纬度），文字被切掉时加大。
   pts：地点（dx/dy/anchor 调文字位置，via:true 是途经小点）；segs：箭头（bend 让线弯曲，dash 虚线表示回程，label 写距离和时间）。 */
const MAPS={
 valq:{aria:"墨城、瓦尔基里科、乔卢拉、普埃布拉路线示意图",pad:[0.3,0.55,0.3,0.08],
  pts:[{id:"C",name:"墨城 Ciudad de México",lon:-99.203,lat:19.443,dy:-14},
   {id:"V",name:"瓦尔基里科 Val'Quirico",lon:-98.292,lat:19.190,dx:14,dy:-8,anchor:"start"},
   {id:"H",name:"乔卢拉 Cholula",lon:-98.45,lat:19.06,dx:-14,dy:5,anchor:"end"},
   {id:"P",name:"普埃布拉 Puebla",lon:-98.198,lat:19.043,dx:14,dy:5,anchor:"start"}],
  segs:[{from:"C",to:"V",bend:[30,-40],label:"① 约 123 公里 · 2 小时",lx:10,ly:-4,anchor:"start"},
   {from:"V",to:"H",label:"② 约 20 公里 · 25 分钟",lx:-8,ly:-6,anchor:"end"},
   {from:"H",to:"P",label:"③ 约 12 公里 · 25 分钟",lx:43,ly:24,anchor:"start"},
   {from:"P",to:"C",bend:[-80,170],dash:true,label:"④ 约 142 公里 · 2.5 小时",lx:-56,ly:-182,anchor:"start"}]},
 yuc:{aria:"尤卡坦半岛海岛游路线示意图：坎昆、女人岛、X 系列乐园、普拉亚德尔卡门、科苏梅尔、图卢姆、奇琴伊察、巴卡拉尔、切图马尔",pad:[0.7,1.15,0.12,0.14],
  pts:[{id:"K",name:"坎昆 Cancún",lon:-86.85,lat:21.16,dx:-12,dy:5,anchor:"end"},
   {id:"M",name:"女人岛 Isla Mujeres",lon:-86.73,lat:21.26,island:true,dx:14,dy:-10,anchor:"start"},
   {id:"P",name:"普拉亚 Playa del Carmen",lon:-87.07,lat:20.66,dx:12,dy:-2,anchor:"start"},
   {id:"XP",name:"X 系列乐园 Xcaret",lon:-87.12,lat:20.58,r:5,dx:-10,dy:-4,anchor:"end"},
   {id:"Z",name:"科苏梅尔 Cozumel",lon:-86.90,lat:20.46,island:true,dx:16,dy:6,anchor:"start"},
   {id:"T",name:"图卢姆 Tulum",lon:-87.46,lat:20.21,dx:12,dy:16,anchor:"start"},
   {id:"C",name:"奇琴伊察 Chichén Itzá",lon:-88.57,lat:20.68,dy:-14},
   {id:"B",name:"巴卡拉尔 Bacalar",lon:-88.39,lat:18.68,dx:-12,dy:5,anchor:"end"},
   {id:"X",name:"切图马尔机场 Chetumal ✈",lon:-88.33,lat:18.50,dx:12,dy:8,anchor:"start"}],
  segs:[{from:"K",to:"P",bend:[-18,0],label:"1 小时 10 分",lx:-8,anchor:"end"},
   {from:"P",to:"T",bend:[-12,0],label:"55 分",lx:-10,ly:16,anchor:"end"},
   {from:"T",to:"C",bend:[0,-30],label:"来回各 2 小时",lx:-30,ly:-10},
   {from:"C",to:"T",bend:[0,30],dash:true},
   {from:"T",to:"B",bend:[30,0],label:"2.5 小时",lx:8,anchor:"start"},
   {from:"B",to:"X",label:"40 分",lx:-10,ly:14,anchor:"end"}]},
 rm5:{aria:"5 天路线示意图：坎昆机场、图卢姆、奇琴伊察、普拉亚德尔卡门、科苏梅尔",pad:[0.25,0.45,0.12,0.12],
  pts:[{id:"A",name:"坎昆机场 ✈",lon:-86.874,lat:21.042,dx:12,dy:5,anchor:"start"},
   {id:"P",name:"普拉亚 Playa del Carmen",lon:-87.074,lat:20.630,dx:-12,dy:-4,anchor:"end"},
   {id:"Z",name:"科苏梅尔 Cozumel",lon:-86.947,lat:20.509,island:true,dx:16,dy:16,anchor:"start"},
   {id:"T",name:"图卢姆 Tulum",lon:-87.458,lat:20.213,dx:12,dy:18,anchor:"start"},
   {id:"C",name:"奇琴伊察 Chichén Itzá",lon:-88.568,lat:20.684,dy:-14}],
  segs:[{from:"A",to:"T",bend:[-95,-10],label:"① 1 小时 25 分",lx:-10,ly:-30,anchor:"end"},
   {from:"T",to:"C",bend:[0,-30],label:"② 来回各约 2 小时",ly:-6},
   {from:"C",to:"T",bend:[0,30],dash:true},
   {from:"T",to:"P",bend:[22,10],label:"③ 50 分",lx:10,ly:6,anchor:"start"},
   {from:"P",to:"Z",bend:[14,-14],label:"④ 船 45 分",lx:12,ly:-12,anchor:"start"},
   {from:"Z",to:"P",bend:[-10,12],dash:true},
   {from:"P",to:"A",bend:[25,0],dash:true,label:"⑤ 40 分",lx:10,anchor:"start"}]},
 mujeres:{aria:"坎昆三个码头到女人岛的坐船示意图",pad:[0.22,0.2,0.02,0.03],
  pts:[{id:"J",name:"Puerto Juárez 码头（市区）",lon:-86.807,lat:21.184,dx:-12,dy:5,anchor:"end"},
   {id:"T",name:"Playa Tortugas 码头（酒店区）",lon:-86.769,lat:21.139,dx:-10,dy:20,anchor:"end"},
   {id:"C",name:"Playa Caracol 码头（酒店区）",lon:-86.747,lat:21.136,dx:12,dy:6,anchor:"start"},
   {id:"M",name:"女人岛 Isla Mujeres",lon:-86.749,lat:21.259,island:true,dx:16,dy:4,anchor:"start"}],
  segs:[{from:"J",to:"M",bend:[-14,-4],label:"船约 30 分钟，班次最多",lx:-12,ly:-6,anchor:"end"},
   {from:"T",to:"M",bend:[-6,0]},
   {from:"C",to:"M",bend:[10,0],label:"酒店区码头直达，一天约 7 班",lx:12,anchor:"start"}]},
 cozumel:{aria:"普拉亚德尔卡门到科苏梅尔坐船示意图",pad:[0.12,0.25,0.04,0.04],
  pts:[{id:"P",name:"普拉亚 Playa del Carmen",lon:-87.074,lat:20.630,dy:-14},
   {id:"Z",name:"科苏梅尔 Cozumel",lon:-86.947,lat:20.509,island:true,dy:28}],
  segs:[{from:"P",to:"Z",bend:[20,-20],label:"① 船约 45 分钟",lx:10,anchor:"start"},
   {from:"Z",to:"P",bend:[-20,20],dash:true,label:"② 回程",lx:-10,anchor:"end"}]},
 chichen:{aria:"坎昆、图卢姆到奇琴伊察自驾时间示意图",pad:[0.55,0.5,0.15,0.12],
  pts:[{id:"K",name:"坎昆酒店区",lon:-86.746,lat:21.134,dx:-12,dy:5,anchor:"end"},
   {id:"T",name:"图卢姆 Tulum",lon:-87.458,lat:20.213,dx:12,dy:5,anchor:"start"},
   {id:"C",name:"奇琴伊察 Chichén Itzá",lon:-88.568,lat:20.684,dy:28}],
  segs:[{from:"K",to:"C",bend:[0,-30],label:"约 2.5 小时",ly:-6},
   {from:"T",to:"C",bend:[0,20],label:"约 2 小时 12 分",ly:22}]},
 xpark:{aria:"坎昆、图卢姆到 Xcaret 自驾时间示意图",pad:[0.75,0.75,0.06,0.08],
  pts:[{id:"K",name:"坎昆酒店区",lon:-86.746,lat:21.134,dx:-12,dy:5,anchor:"end"},
   {id:"X",name:"Xcaret",lon:-87.120,lat:20.581,dx:12,dy:5,anchor:"start"},
   {id:"T",name:"图卢姆 Tulum",lon:-87.458,lat:20.213,dx:12,dy:5,anchor:"start"}],
  segs:[{from:"K",to:"X",bend:[-20,0],label:"约 1 小时 7 分",lx:-8,anchor:"end"},
   {from:"T",to:"X",bend:[-20,0],label:"约 45 分钟",lx:-8,anchor:"end"}]},
 cenote:{aria:"图卢姆到大天然井、双眼天然井示意图",pad:[0.22,0.22,0.03,0.04],
  pts:[{id:"T",name:"图卢姆镇 Tulum",lon:-87.458,lat:20.213,dx:12,dy:5,anchor:"start"},
   {id:"G",name:"大天然井 Gran Cenote",lon:-87.464,lat:20.247,dx:-12,dy:5,anchor:"end"},
   {id:"D",name:"双眼天然井 Dos Ojos",lon:-87.391,lat:20.325,dx:12,dy:5,anchor:"start"}],
  segs:[{from:"T",to:"G",bend:[-12,0],label:"约 7 分钟",lx:-8,anchor:"end"},
   {from:"T",to:"D",bend:[20,0],label:"约 27 分钟",lx:8,anchor:"start"}]},
 bacalar:{aria:"墨城飞切图马尔、图卢姆开车到巴卡拉尔示意图",pad:[1.1,1.3,0.1,0.12],
  pts:[{id:"M",name:"墨城 Ciudad de México ✈",lon:-89.75,lat:19.15,dx:0,dy:-14},
   {id:"T",name:"图卢姆 Tulum",lon:-87.458,lat:20.213,dx:12,dy:5,anchor:"start"},
   {id:"B",name:"巴卡拉尔 Bacalar",lon:-88.390,lat:18.678,dx:-12,dy:5,anchor:"end"},
   {id:"X",name:"切图马尔机场 Chetumal ✈",lon:-88.327,lat:18.505,dx:12,dy:8,anchor:"start"}],
  segs:[{from:"M",to:"X",bend:[10,40],label:"飞机约 2 小时",lx:-6,ly:14,anchor:"end"},
   {from:"X",to:"B",bend:[18,0],label:"约 40 分钟",lx:16,ly:-14,anchor:"start"},
   {from:"T",to:"B",bend:[30,0],dash:true,label:"或从图卢姆开车约 2.5 小时",lx:8,anchor:"start"}]},
 teo:{aria:"墨城、特奥蒂瓦坎往返路线示意图",pad:[0.15,0.4,0.08,0.06],
  pts:[{id:"C",name:"墨城 Ciudad de México",lon:-99.2031,lat:19.4413,dy:28},
   {id:"T",name:"特奥蒂瓦坎 Teotihuacán",lon:-98.8438,lat:19.6925,dx:14,dy:5,anchor:"start"}],
  segs:[{from:"C",to:"T",bend:[-30,-40],label:"① 约 55 公里 · 1 小时 15 分钟",lx:-8,anchor:"end"},
   {from:"T",to:"C",bend:[40,40],dash:true,label:"② 回程",lx:8,anchor:"start"}]},
 zocalo:{aria:"酒店到宪法广场路线示意图",pad:[0.02,0.04,0.012,0.01],
  pts:[{id:"C",name:"酒店（Polanco 一带）",lon:-99.2031,lat:19.4413,dy:-16},
   {id:"Z",name:"宪法广场 Zócalo",lon:-99.1332,lat:19.4326,dy:28}],
  segs:[{from:"C",to:"Z",bend:[0,-30],label:"① 约 9.6 公里 · 35 分钟",ly:-6},
   {from:"Z",to:"C",bend:[0,30],dash:true,label:"② 回酒店",ly:16}]},
 frida:{aria:"酒店到蓝房子路线示意图",pad:[0.12,0.18,0.015,0.015],
  pts:[{id:"C",name:"酒店（Polanco 一带）",lon:-99.2031,lat:19.4413,dx:14,dy:5,anchor:"start"},
   {id:"F",name:"蓝房子 Casa Azul",lon:-99.1625,lat:19.3551,dx:14,dy:5,anchor:"start"}],
  segs:[{from:"C",to:"F",bend:[-40,0],label:"① 约 14.5 公里 · 35–45 分钟",lx:-8,anchor:"end"},
   {from:"F",to:"C",bend:[40,0],dash:true,label:"② 回酒店",lx:8,anchor:"start"}]},
 vasco:{aria:"酒店到瓦斯孔塞洛斯图书馆路线示意图",pad:[0.02,0.045,0.012,0.012],
  pts:[{id:"C",name:"酒店（Polanco 一带）",lon:-99.2031,lat:19.4413,dy:28},
   {id:"V",name:"瓦斯孔塞洛斯图书馆 Biblioteca Vasconcelos",lon:-99.1527,lat:19.4466,dy:28}],
  segs:[{from:"C",to:"V",bend:[0,-25],label:"① 约 7.8 公里 · 25 分钟",ly:-6},
   {from:"V",to:"C",bend:[0,25],dash:true,label:"② 回酒店",ly:16}]},
 antro:{aria:"酒店到国家人类学博物馆路线示意图",pad:[0.02,0.035,0.012,0.01],
  pts:[{id:"C",name:"酒店（Polanco 一带）",lon:-99.2031,lat:19.4413,dy:-16},
   {id:"M",name:"国家人类学博物馆 Museo Nacional de Antropología",lon:-99.1863,lat:19.4260,dy:28}],
  segs:[{from:"C",to:"M",bend:[30,-30],label:"① 约 5.6 公里 · 16–20 分钟",lx:10,anchor:"start"},
   {from:"M",to:"C",bend:[-30,30],dash:true,label:"② 回酒店",lx:-10,anchor:"end"}]},
 estacas:{aria:"墨城、冷水湖往返路线示意图",pad:[1,1,0.06,0.1],
  pts:[{id:"C",name:"墨城 Ciudad de México",lon:-99.203,lat:19.443,dx:14,dy:5,anchor:"start"},
   {id:"E",name:"冷水湖 Las Estacas",lon:-99.116,lat:18.733,dx:14,dy:5,anchor:"start"},
   {id:"Q",name:"Cuernavaca（途经）",lon:-99.234,lat:18.924,via:true,dx:-10,dy:4,anchor:"end"}],
  segs:[{from:"C",to:"E",bend:[-60,0],label:"① 约 131 公里 · 2 小时",lx:-8,ly:-30,anchor:"end"},
   {from:"E",to:"C",bend:[60,0],dash:true,label:"② 回程 约 129 公里 · 2 小时",lx:8,anchor:"start"}]},
 valle:{aria:"墨城、巴耶德布拉沃往返路线示意图",pad:[0.35,0.35,0.24,0.22],
  pts:[{id:"C",name:"墨城 Ciudad de México",lon:-99.203,lat:19.443,dy:-16},
   {id:"V",name:"巴耶德布拉沃 Valle de Bravo",lon:-100.131,lat:19.195,dy:28},
   {id:"T",name:"Toluca（途经）",lon:-99.656,lat:19.292,via:true,dx:10,dy:4,anchor:"start"}],
  segs:[{from:"C",to:"V",bend:[0,-80],label:"① 约 135 公里 · 2–2.5 小时",ly:4},
   {from:"V",to:"C",bend:[0,90],dash:true,label:"② 回程 约 135 公里 · 2–2.5 小时",ly:6}]}
};

/* 行程安排里的多日路线。only:"stay" / only:"back" 表示只在「3 天」或「2 天」版本里显示。
   这里只写玩什么，不写交通时间（交通放在「路线和交通」）。 */
const ROUTES={
 smagto:{
  options:[["stay","3 天：第二晚住瓜纳华托"],["back","2 天：当晚开回墨城"]],
  stops:[
   {when:"第 1 天",title:"早上从墨城出发，前往圣米格尔（San Miguel de Allende）"},
   {title:"圣米格尔（San Miguel de Allende）：下午到晚上",body:"[[pid:ChIJe3LiqbBRK4QRovZrXZsp_38|Parroquia de San Miguel Arcángel|粉色教堂（Parroquia de San Miguel Arcángel）]]、[[pid:ChIJUeyHqbBRK4QR06PArO4QIPA|Jardín Allende San Miguel de Allende|主广场（Jardín Principal）]]，老城石板路随便走走，傍晚找屋顶餐厅看日落。住老城附近。"},
   {when:"第 2 天",title:"早上前往瓜纳华托（Guanajuato）"},
   {title:"瓜纳华托（Guanajuato）：一整天",body:"[[pid:EjtDam9uLiBkZWwgQmVzbywgWm9uYSBDZW50cm8sIDM2MDAwIEd1YW5hanVhdG8sIEd0by4sIE1leGljbyIuKiwKFAoSCZ0ciR8GdCuEETmkV6tP1PQEEhQKEgnr8QyL9XMrhBF0Hldl0bD0JQ|Callejón del Beso Guanajuato|亲吻巷（Callejón del Beso）]]、[[pid:ChIJRXsG7wd0K4QRzW1Z2LzN9Kc|Teatro Juárez Guanajuato|华雷斯剧院（Teatro Juárez）]]、坐[[pid:ChIJxZslkgd0K4QRxHnojWEzoIQ|Funicular Guanajuato|缆车（Funicular）]]上 [[pid:ChIJxbN77Ad0K4QRjH1svVb-bsI|Mirador Pípila Guanajuato|Pípila 观景台]]看彩色山城，穿一段地下隧道公路，中午去 [[pid:ChIJjQ2UmiZ1K4QR5PxTzOrPqvU|Mercado Hidalgo Guanajuato|Mercado Hidalgo]] 吃饭。",bodyStay:"住老城中心附近。"},
   {when:"第 3 天",title:"上午再逛一会儿，午饭后回墨城（Ciudad de México）",body:"早上人少，适合补拍。",only:"stay"},
   {title:"傍晚出发回墨城（Ciudad de México）",only:"back"},
   {when:"第 3 天",title:"晚上到家",only:"stay"},
   {when:"第 2 天",title:"晚上到家",only:"back"}
  ],
  foot:"每段路上要多久、怎么坐车，看「路线和交通」。"
 },
 valle:{
  options:[["stay","2 天 1 晚"],["back","1 天来回"]],
  stops:[
   {when:"第 1 天",title:"早上从墨城出发，前往巴耶德布拉沃（Valle de Bravo）"},
   {title:"中午：湖上坐船，吃烤鳟鱼",body:"到 [[pid:ChIJXZecL3lkzYURC0assyHrQhE|Embarcadero Municipal Valle de Bravo|市政码头（Embarcadero Municipal）]] 坐船绕湖，看湖边别墅和山景。午饭在湖边吃本地烤鳟鱼（trucha）。"},
   {title:"下午：逛小镇中心",body:"老街、广场、咖啡店和手工艺品店随便走走；[[pid:ChIJZZI3BYdjzYURpEu6uBntuos|Mercado Municipal Valle de Bravo|市场（Mercado Municipal）]]可以买便宜的水果。"},
   {title:"傍晚：拉佩尼亚观景台看日落",body:"爬 10–20 分钟上 [[pid:ChIJ1yzmZY5jzYURE07h19ItKe8|Mirador La Peña Valle de Bravo|拉佩尼亚观景台（Mirador La Peña）]]，俯瞰整个湖和小镇。",bodyStay:"晚上住镇中心或阿万达罗（Avándaro）。"},
   {title:"傍晚出发回墨城（Ciudad de México）",only:"back"},
   {when:"第 1 天",title:"晚上到家",only:"back"},
   {when:"第 2 天",title:"上午：滑翔伞（parapente）",body:"网友建议安排在上午，风比较稳。不想飞的话，在降落点看别人落地、拍照也很好看。",only:"stay"},
   {title:"中午：婚纱瀑布（Cascada Velo de Novia）",body:"[[pid:ChIJe_XMCkFkzYURy-FthBG6qiw|Cascada Velo de Novia Valle de Bravo|婚纱瀑布（Cascada Velo de Novia）]]，林间步道比较凉快，可以骑马。",only:"stay"},
   {title:"下午出发回墨城（Ciudad de México）",only:"stay"},
   {when:"第 2 天",title:"晚上到家",only:"stay"}
  ],
  foot:"路上要多久、怎么坐车，看「路线和交通」。"
 },
 yuc:{
  options:[["stay","9 天深度游：坎昆进，切图马尔出"],["back","5 天精简游：坎昆进出"]],
  stops:[
   {when:"第 1 天",title:"墨城飞坎昆（Cancún），住酒店区",body:"下午到酒店放行李、看海。晚上可以去市区的[[pid:ChIJq_CpNwcsTI8RucHSC99UCho|Parque de las Palapas Cancún|拉斯帕拉帕斯公园（Parque de las Palapas）]]逛夜市。"},
   {when:"第 2 天",title:"女人岛（Isla Mujeres）一日游",body:"坐 Ultramar 船上岛，先去[[pid:ChIJRTrNNgMwTI8R_uGrRh86_GY|Playa Norte Isla Mujeres|北海滩（Playa Norte）]]，再打车或开高尔夫球车去最南端的[[pid:ChIJQVVbfaglTI8RCdudYGGQbYk|Punta Sur Isla Mujeres|南端断崖（Punta Sur）]]。傍晚坐船回坎昆，网友说船上二楼露天位置能看日落。"},
   {when:"第 3 天",title:"X 系列乐园玩一整天，晚上住普拉亚德尔卡门（Playa del Carmen）",body:"三选一：[[pid:ChIJU3DYrW1ETo8RpQkYkh7oQoA|Xcaret Park|Xcaret]]（自然 + 水上 + 晚上的大秀，第一次来网友首推）、[[pid:ChIJ44qsfvVDTo8Rs89AYspFfVY|Xplor Park|Xplor]]（滑索、越野车、地下河，最刺激）、[[pid:ChIJwf__P8kyTo8RlnFHVjYm4w8|Parque Xel-Há|Xel-Há]]（浮潜、漂流，最轻松）。网友说一天玩一个园区最舒服。"},
   {when:"第 4 天",title:"科苏梅尔（Cozumel）一日游",body:"从普拉亚码头坐船上岛，报浮潜船去[[map:El Cielo Cozumel|El Cielo]]看海星（不能碰），或者坐[[pid:ChIJIVRicM1ZTo8RGJ31pNAPnr4|Atlantis Submarines Cozumel|Atlantis 潜水艇]]看海底。傍晚回普拉亚，逛[[pid:ChIJO-CSZjlDTo8RVyEOZ9c6Ngs|Quinta Avenida Playa del Carmen|第五大道（Quinta Avenida）]]。",only:"stay"},
   {when:"第 5 天",title:"上午：图卢姆遗址；下午：大天然井",body:"8 点开门就进[[pid:ChIJZTIpFn3RT48RY8mSpPzWaP8|Tulum Archaeological Zone|图卢姆遗址（Zona Arqueológica de Tulum）]]，建在海边悬崖上的玛雅遗址，下面有沙滩。下午去[[pid:ChIJ_xjkInTUT48Rit_t2yqp8M4|Gran Cenote Tulum|大天然井（Gran Cenote）]]和海龟一起游。晚上住图卢姆。",only:"stay"},
   {when:"第 4 天",title:"上午：图卢姆遗址；下午：大天然井",body:"8 点开门就进[[pid:ChIJZTIpFn3RT48RY8mSpPzWaP8|Tulum Archaeological Zone|图卢姆遗址（Zona Arqueológica de Tulum）]]；下午去[[pid:ChIJ_xjkInTUT48Rit_t2yqp8M4|Gran Cenote Tulum|大天然井（Gran Cenote）]]。晚上住图卢姆。",only:"back"},
   {when:"第 6 天",title:"双眼天然井和莲花池",body:"[[pid:ChIJ3bHaTUUtTo8R6FlVhvaTBzE|Cenote Dos Ojos|双眼天然井（Dos Ojos）]]跟向导浮潜进钟乳石洞穴和蝙蝠洞；同一个园区里的[[map:Cenote Nicte-Ha|莲花池（Cenote Nicte-Ha）]]水下有睡莲。网友建议工作日早上去，人少。",only:"stay"},
   {when:"第 7 天",title:"奇琴伊察（Chichén Itzá）一日游",body:"早点出发避开正午暴晒：先看[[pid:ChIJ58CR48Y4UY8Rmk2ZaKGgHnw|Chichén Itzá|奇琴伊察]]的库库尔坎金字塔（El Castillo），在金字塔前拍手能听到像鸟叫的回声；再去附近的[[pid:ChIJl11soik_UY8RSO0deqb8H8w|Cenote Ik Kil|Ik Kil 天然井]]跳水，或者去巴利亚多利德（Valladolid）旁边的[[pid:ChIJgUUxAkwLUY8R9jmV2-1HzpU|Cenote Suytun|Suytun 天然井]]拍光束。晚上回图卢姆，或住巴利亚多利德小镇。",only:"stay"},
   {when:"第 8 天",title:"到巴卡拉尔（Bacalar），下午漂流",body:"下午去[[map:Los Rápidos de Bacalar|天然河道漂流（Los Rápidos de Bacalar）]]，穿救生衣顺水漂，网友推荐 4 点到 6 点赶上日落；或者去[[pid:ChIJfcCPci-3W48R1iFEBvedXSw|Cenote Cocalitos Bacalar|Cocalitos]]看分层的七色湖水。住湖边。",only:"stay"},
   {when:"第 9 天",title:"早上坐船游七色湖，下午从切图马尔（Chetumal）飞回墨城",body:"报帆船或浮桥船游湖，经过天然井和海盗运河（Canal de los Piratas）；也可以租皮划艇。湖里有活的叠层石，不要踩。",only:"stay"},
   {when:"第 5 天",title:"上午：双眼天然井，下午回坎昆机场飞墨城",body:"[[pid:ChIJ3bHaTUUtTo8R6FlVhvaTBzE|Cenote Dos Ojos|双眼天然井（Dos Ojos）]]跟向导浮潜进洞穴，中午前结束，留足时间去机场。",only:"back"}
  ],
  foot:"路上要多久、怎么坐车坐船，看「路线和交通」。"
 },
 rm5:{
  options:[["stay","5 天：图卢姆 2 晚 + 普拉亚 2 晚"]],
  stops:[
   {when:"第 1 天",title:"墨城飞坎昆（Cancún），从机场直接去图卢姆（Tulum）住下",body:"网友首推住图卢姆镇中心（downtown），吃饭、超市都方便。"},
   {title:"下午：图卢姆遗址或海边",body:"[[pid:ChIJZTIpFn3RT48RY8mSpPzWaP8|Tulum Archaeological Zone|图卢姆遗址（Zona Arqueológica de Tulum）]]建在海边悬崖上，INAH 公告 17:00 关门，到得早可以下午去；网友更推荐早上 8 点开门就进，人少不晒，也可以挪到第 3 天早上。晚上在镇中心吃饭。"},
   {when:"第 2 天",title:"奇琴伊察（Chichén Itzá）一日游，晚上回图卢姆",body:"早点出发，8 点开门就进[[pid:ChIJ58CR48Y4UY8Rmk2ZaKGgHnw|Chichén Itzá|奇琴伊察]]，网友说 9:30 以后人和太阳都上来了。中午去 [[pid:ChIJl11soik_UY8RSO0deqb8H8w|Cenote Ik Kil|Ik Kil]] 或 [[pid:ChIJgUUxAkwLUY8R9jmV2-1HzpU|Cenote Suytun|Suytun]] 天然井，下午在巴利亚多利德（Valladolid）小镇吃饭逛逛。详细走法看奇琴伊察页面的「行程安排」。"},
   {when:"第 3 天",title:"上午：大天然井或双眼天然井（二选一）",body:"[[pid:ChIJ_xjkInTUT48Rit_t2yqp8M4|Gran Cenote Tulum|大天然井（Gran Cenote）]]离镇上很近，水池开阔，能和海龟一起游；[[pid:ChIJ3bHaTUUtTo8R6FlVhvaTBzE|Cenote Dos Ojos|双眼天然井（Dos Ojos）]]是洞穴天然井，跟向导浮潜看钟乳石。网友建议早上去，人少。"},
   {title:"下午：搬到普拉亚德尔卡门（Playa del Carmen）",body:"傍晚逛[[pid:ChIJO-CSZjlDTo8RVyEOZ9c6Ngs|Quinta Avenida Playa del Carmen|第五大道（Quinta Avenida）]]，吃饭、买东西都在这条街上。"},
   {when:"第 4 天",title:"科苏梅尔（Cozumel）一日游，傍晚回普拉亚",body:"从普拉亚码头坐船上岛，报浮潜船去 El Cielo 看海星（不能碰），或者坐 Atlantis 潜水艇看海底。详细走法看科苏梅尔页面的「行程安排」。"},
   {when:"第 5 天",title:"上午：普拉亚海边",body:"网友推荐普拉亚的公共海滩（[[map:Playa del Carmen Public Beach|Playa del Carmen Public Beach]]），免费，没那么商业化。"},
   {title:"下午：去坎昆机场，飞回墨城",body:"午饭后出发，留足时间。"}
  ],
  foot:"每段路上要多久、怎么坐车坐船，看「路线和交通」。"
 },
 chichen:{
  options:[["cun","从坎昆酒店出发"],["tqo","从图卢姆出发"]],
  stops:[
   {when:"早上",title:"6:30–7 点从坎昆酒店出发",body:"自驾、包车、跟团都差不多这个时间出发。网友提醒：大巴团要沿路接人，到景区常常已经 9:30 以后，想人少可以选小团、私人团或包车。",only:"cun"},
   {when:"早上",title:"7 点前从图卢姆出发",body:"网友提醒尤卡坦州比金塔纳罗奥州慢 1 小时，到了以后看清当地时间。",only:"tqo"},
   {title:"上午：奇琴伊察（Chichén Itzá）",body:"8 点开门就进[[pid:ChIJ58CR48Y4UY8Rmk2ZaKGgHnw|Chichén Itzá|奇琴伊察]]，先拍库库尔坎金字塔（El Castillo）的全景，网友说 9:30 以后人陡然增多、温度往上冲。景区几乎没有遮阴，带帽子、墨镜、防晒和水；纪念品先问好价再砍价。想听历史可以在售票处买讲解服务。"},
   {title:"中午：天然井游泳",body:"[[pid:ChIJl11soik_UY8RSO0deqb8H8w|Cenote Ik Kil|Ik Kil 天然井]]可以下水游泳，必须穿救生衣，网友说门票 240 比索、含储物柜和救生衣；[[pid:ChIJgUUxAkwLUY8R9jmV2-1HzpU|Cenote Suytun|Suytun 天然井]]正午阳光从顶上的圆洞照下来最出片，网友建议穿浅色衣服。"},
   {title:"下午：巴利亚多利德（Valladolid）小镇",body:"彩色街道和教堂，中间广场有卖纪念品的小摊，可以在这里吃饭。"},
   {when:"傍晚",title:"返回酒店"}
  ],
  foot:"怎么去、要多久、跟团还是自驾，看「路线和交通」。"
 },
 xpark:{
  options:[["cun","从坎昆酒店出发"],["tqo","从图卢姆出发"]],
  stops:[
   {when:"早上",title:"7 点左右从坎昆酒店出发",body:"网友订的「门票 + 接送」套餐，早上 7 点左右到酒店接。",only:"cun"},
   {when:"早上",title:"8 点左右从图卢姆出发",only:"tqo"},
   {title:"上午 8:30 开园：地下河和海边",body:"[[pid:ChIJU3DYrW1ETo8RpQkYkh7oQoA|Xcaret Park|Xcaret]] 主要玩地下河漂流、海边浮潜、看动物。网友说一天只玩一个园区最舒服；也可以换成 [[pid:ChIJ44qsfvVDTo8Rs89AYspFfVY|Xplor Park|Xplor]]（滑索、越野车，最刺激）或 [[pid:ChIJwf__P8kyTo8RlnFHVjYm4w8|Parque Xel-Há|Xel-Há]]（浮潜、漂流，最轻松）。园区里的额外项目要另外买。"},
   {title:"中午：园区里吃饭",body:"买票时看清套餐含不含餐，具体看「餐厅美食」。园区里有接水点，可以带水杯。"},
   {title:"晚上 7:30：墨西哥大秀",body:"网友说 Xcaret 晚上的大秀《Xcaret México Espectacular》一定要看，坐低处的位置更凉快。"},
   {when:"晚上",title:"返回酒店",body:"看秀的话 9 点多散场；不看秀，网友下午 3:30 左右就回到酒店了。"}
  ],
  foot:"怎么去、打车多少钱，看「路线和交通」。"
 },
 mujeres:{
  options:[["stay","一日游：从坎昆出发"]],
  stops:[
   {when:"上午",title:"坐船上岛",body:"网友建议 9 点前上岛，人少；船上坐二楼露天位置，一路看海。"},
   {title:"北海滩（Playa Norte）",body:"下船走 10–20 分钟到[[pid:ChIJRTrNNgMwTI8R_uGrRh86_GY|Playa Norte Isla Mujeres|北海滩（Playa Norte）]]，水很浅、浪小，沙子细软。网友推荐 Zazil-Ha 那一段人少，西边船多比较吵；右手边有海边餐厅和饮料店，有秋千，椰子比酒店区便宜。"},
   {title:"中午：步行街吃饭",body:"码头和北海滩之间的步行街有海鲜餐厅和咖啡店，看「餐厅美食」。"},
   {title:"下午：南端断崖（Punta Sur）",body:"打车或开高尔夫球车去岛的最南端[[pid:ChIJQVVbfaglTI8RCdudYGGQbYk|Punta Sur Isla Mujeres|南端断崖（Punta Sur）]]，悬崖看海、有雕塑公园和一座小玛雅神庙遗址，网友说雕塑公园门票 6–8 美元。想浮潜可以去旁边的 [[pid:ChIJHUZY9QolTI8Rs7nB1wWDF98|Club De Playa At Garrafon De Castilla|Garrafón de Castilla 海滩俱乐部]]（Google 4.3 ★（362 条）），网友说门票 150 比索、装备每件 50 比索，鱼不多。"},
   {when:"傍晚",title:"回码头坐船，返回坎昆酒店",body:"回程正好看日落。网友提醒下午 2:30 以后的班次可能直接跳到 4 点，先看好时刻表。"}
  ],
  foot:"怎么坐船、岛上怎么走，看「路线和交通」。"
 },
 cozumel:{
  options:[["stay","一日游：从普拉亚出发"]],
  stops:[
   {when:"上午",title:"从普拉亚码头坐船上岛",body:"网友建议早上去、下午回，下午鱼会少一点。"},
   {title:"浮潜：El Cielo、Columbia、Palancar",body:"网友说跳岛浮潜通常去 3 个点：[[map:El Cielo Cozumel|El Cielo]] 水浅、满地海星（不能碰，会罚款）；Columbia 礁鱼多、珊瑚多，比 El Cielo 深一点，适合会游泳的；Palancar 礁是世界级潜点。El Cielo 一般只停 15–30 分钟。网友建议报小团或包船，别选太便宜的团。不想下水可以坐 [[pid:ChIJIVRicM1ZTo8RGJ31pNAPnr4|Atlantis Submarines Cozumel|Atlantis 潜水艇]]。"},
   {title:"中午：镇上吃 taco 或海鲜",body:"看「餐厅美食」。"},
   {title:"下午：海滩俱乐部或南部公园",body:"网友在 [[pid:ChIJYXkqXRNRTo8R7uGYCTznDOQ|Skyreef Beach Club Cozumel|Skyreef 海滩俱乐部]]（Google 4.6 ★（3,946 条））下水浮潜；南边有 [[pid:ChIJAflEe8msT48R8KN9L5HOFic|Punta Sur Eco Beach Park|Punta Sur 生态公园]]。纪念品在中心广场买，货比三家、讲价。"},
   {when:"傍晚",title:"坐船回普拉亚德尔卡门"}
  ],
  foot:"怎么坐船、岛上怎么走，看「路线和交通」。"
 },
 bacalar:{
  options:[["stay","3 天 2 晚"]],
  stops:[
   {when:"第 1 天",title:"墨城飞切图马尔（Chetumal），中午后到巴卡拉尔住湖边"},
   {title:"下午：Cocalitos 和 Ecoparque",body:"[[pid:ChIJfcCPci-3W48R1iFEBvedXSw|Cenote Cocalitos Bacalar|Cocalitos]] 看分层的七色湖水，湖边有秋千；[[pid:ChIJVahpdpCxW48RttP8HzLbwu8|Ecoparque Bacalar|Ecoparque Bacalar]] 有木栈道，可以下水泡着，网友说门票约 20 比索，不能带饮料和食物，傍晚 6 点半左右关门。"},
   {when:"第 2 天",title:"上午：坐船游七色湖",body:"报帆船或浮桥船，经过海盗水道（Canal de los Piratas）和黑色天然井（Cenote Negro），浅水区可以停下来游泳。网友说早上 8–11 点湖水颜色最明显。湖里有活的叠层石，不要踩。"},
   {title:"中午：回湖边休息",body:"中午很晒，网友在湖边民宿躺到下午 3 点再出门。"},
   {title:"下午 4–6 点：Los Rápidos 漂流",body:"[[map:Los Rápidos de Bacalar|Los Rápidos de Bacalar]] 穿救生衣顺水漂，不会游泳也可以。网友建议 4 点到 6 点去，没那么晒，赶上日落，正好漂到关门；园区里有餐厅。"},
   {when:"第 3 天",title:"早上：皮划艇或桨板",body:"很多湖边酒店免费借皮划艇和桨板；也可以去[[pid:ChIJe-inaDmxW48RuCejDviGmOI|Fuerte de San Felipe de Bacalar|圣费利佩堡（Fuerte de San Felipe）]]（Google 4.6 ★（18,016 条）），网友说门票很便宜，可以登高看全湖。"},
   {title:"中午退房，去切图马尔机场飞回墨城"}
  ],
  foot:"怎么去、到了以后怎么打车，看「路线和交通」。"
 },
 teo:{
  options:[["stay","一整天：遗址 + 洞穴餐厅 + 缆车"],["back","半天：只看遗址"]],
  stops:[
   {when:"早上",title:"7 点左右从墨城出发，8 点开门时到特奥蒂瓦坎（Teotihuacán）",body:"网友建议 8 点前到，避开旅行团和中午暴晒。门票只收现金。"},
   {title:"上午：从 3 号门进，月亮金字塔 → 亡灵大道 → 太阳金字塔",body:"网友推荐从 3 号门进：先看[[map:Pirámide de la Luna Teotihuacán|月亮金字塔（Pirámide de la Luna）]]和旁边的奎兹尔帕帕洛特宫（Palacio de Quetzalpapálotl），沿[[map:Calzada de los Muertos Teotihuacán|亡灵大道（Calzada de los Muertos）]]往南走到[[pid:ChIJ-Q-zXoTq0YUROAxtvosnhK0|Pyramid of the Sun Teotihuacan|太阳金字塔（Pirámide del Sol）]]，草地上常有松鼠。能不能爬金字塔网友说法不一，以现场为准。"},
   {title:"中午：太阳金字塔后面的博物馆，再到羽蛇神庙",body:"太阳金字塔后面有一座小博物馆；最南边是[[map:Templo de Quetzalcóatl Teotihuacán|羽蛇神庙（Templo de Quetzalcóatl）]]。网友说从月亮金字塔走到羽蛇神庙很远，全程约 3 公里土路。"},
   {title:"中午：洞穴餐厅吃饭",body:"从太阳金字塔后面的 5 号门出去，走五六分钟到[[pid:ChIJUe8vcIHq0YUR3bTiJN-8cn8|La Gruta Teotihuacan|洞穴餐厅 La Gruta]]，网友说凭门票还能回景区。具体看「餐厅美食」。",only:"stay"},
   {title:"下午：回程顺路坐 Indios Verdes 缆车",body:"网友推荐回墨城路上坐 [[map:Cablebús Indios Verdes|Cablebús 缆车（Indios Verdes 站）]]看彩色山坡房子：坐主线到 Campos Revolución 换支线到 Tlalpexco，不出站再坐回来，网友说全程约 90 分钟，只刷一次卡约 7 比索。坐大巴的话可以在 Indios Verdes 下车。",only:"stay"},
   {title:"傍晚到家",only:"stay"},
   {title:"中午出发回墨城，下午到家",only:"back"}
  ],
  foot:"怎么去、要多久，看「路线和交通」。"
 },
 zocalo:{
  options:[["stay","一整天：老城步行线"],["back","半天：国家宫 + 大教堂 + 大神庙"]],
  stops:[
   {when:"上午",title:"9:30 前到国家宫对面排队领参观号",body:"网友说参观[[map:Palacio Nacional Ciudad de México|国家宫（Palacio Nacional）]]免费，但只能当天现场登记：到对面的 [[map:Museo de la SHCP Antiguo Palacio del Arzobispado|Museo de la SHCP（旧大主教宫）]]排队，10 点开门发号，每个人都要到、要带护照原件，一组押一本护照；英文团有 10:30、11:30、13:00 等场次，每组 20 人左右，周一不开放。"},
   {title:"上午：国家宫看迭戈·里维拉壁画",body:"跟着导游进去约 1 小时，只能拍走廊和壁画。重点是主楼梯的《墨西哥人民的史诗》和二楼回廊的特诺奇蒂特兰（Tenochtitlan）古城全景。"},
   {title:"中午：大教堂和大神庙遗址",body:"[[pid:ChIJ4a8nxjL50YURJ19RJ_A9T5E|Catedral Metropolitana Ciudad de México|大教堂（Catedral Metropolitana）]]网友说免费，地基下沉、肉眼能看出倾斜。旁边是[[map:Templo Mayor Ciudad de México|大神庙遗址（Templo Mayor）]]，室外遗址能看到七次扩建一层压一层，室内博物馆有月亮女神石雕。"},
   {title:"下午：沿马德罗步行街走到艺术宫",body:"从广场沿[[map:Calle Madero Ciudad de México|马德罗步行街（Calle Madero）]]往西，经过[[pid:ChIJL0UaXyv50YURNyz05p6HsQg|Casa de los Azulejos|瓷砖之家（Casa de los Azulejos）]]、[[map:Palacio Postal Ciudad de México|邮政宫（Palacio Postal）]]，走到[[map:Palacio de Bellas Artes|艺术宫（Palacio de Bellas Artes）]]，二楼有奥罗斯科、里维拉、西凯罗斯的大壁画。",only:"stay"},
   {title:"傍晚回酒店",only:"stay"},
   {title:"下午回酒店",only:"back"}
  ],
  foot:"怎么去、要多久，看「路线和交通」。"
 },
 frida:{
  options:[["stay","一整天：蓝房子 + 科约阿坎"],["back","半天：只看蓝房子"]],
  stops:[
   {when:"出发前",title:"提前在官网买好票",body:"官网买票时要选日期和入场时段。网友建议至少提前 1–2 周，旺季和亡灵节前后要提前一个月；迟到 15 分钟会被取消。官网抢不到票的话，网友说可以看 Klook、GetYourGuide 等平台的含票 tour。"},
   {when:"上午",title:"按预约时段进蓝房子",body:"[[pid:ChIJOz-6AMT_0YURofTM9_ekAWI|Museo Frida Kahlo|蓝房子（Casa Azul · Museo Frida Kahlo）]]进门要寄包，手机可以带进去。网友说仔细看完约 1–2 小时；院子里有小咖啡馆。去之前可以先看电影《弗里达》（Frida，2002）。"},
   {title:"中午：科约阿坎市场吃午饭",body:"走几分钟到[[pid:ChIJeYLOZMT_0YURFEhp2ubb43c|Mercado de Coyoacán|科约阿坎市场（Mercado de Coyoacán）]]，具体看「餐厅美食」。"},
   {title:"下午：逛科约阿坎，或去 Anahuacalli 博物馆",body:"在科约阿坎老街吃油条、喝咖啡，逛[[map:Bazar Artesanal Mexicano Coyoacán|手工艺品市集（Bazar Artesanal Mexicano）]]；网友说蓝房子的门票也能进[[map:Museo Diego Rivera Anahuacalli|迭戈·里维拉的 Anahuacalli 博物馆]]，打车约 20 分钟（网友付过 55 比索），像一座小金字塔，约 1 小时。",only:"stay"},
   {title:"傍晚回酒店",only:"stay"},
   {title:"午饭后回酒店",only:"back"}
  ],
  foot:"怎么去、要多久，看「路线和交通」。"
 },
 vasco:{
  options:[["stay","半天：图书馆 + 旁边商场"],["back","1–2 小时：只看图书馆"]],
  stops:[
   {when:"出发前",title:"先确认图书馆当天开门",body:"官网目前打不开，Google 地图曾显示「永久停业」，2025 年也因为抗议临时关过几次（见简介）。出发前看一下新闻或社交媒体。"},
   {title:"到图书馆，一楼仰拍鲸鱼和悬浮书架",body:"[[pid:ChIJ6d9af9n40YURPUNrUN4aOKs|Biblioteca Vasconcelos|瓦斯孔塞洛斯图书馆（Biblioteca Vasconcelos）]]：网友说在一楼大厅正中仰拍，鲸鱼骨架和层层书架的空间感最明显。"},
   {title:"上楼俯拍中庭",body:"坐电梯到高层连廊往下拍，几何感最强。这里是真正在用的公共图书馆，保持安静。"},
   {title:"顺路逛旁边的 Fórum Buenavista 商场，吃饭休息",body:"网友说图书馆附近几百米就是[[map:Fórum Buenavista|Fórum Buenavista 商场]]。",only:"stay"},
   {title:"回酒店"}
  ],
  foot:"怎么去、要多久，看「路线和交通」。"
 },
 antro:{
  options:[["stay","一整天：博物馆 + Polanco 晚饭"],["back","半天：只看博物馆"]],
  stops:[
   {when:"上午",title:"9 点开门前后到国家人类学博物馆（Museo Nacional de Antropología）",body:"网友建议周二到周五早上去，人少；周日墨西哥人和在墨居民免费，人特别多。只能带小包进馆，大包放免费寄存处。"},
   {title:"上午：先逛一楼的古文明展厅",body:"网友推荐的顺序：检票后从右边开始，特奥蒂瓦坎厅（Teotihuacán，羽蛇神神庙模型）→ 墨西加厅（Sala Mexica，阿兹特克太阳石）→ 奥尔梅克厅（Olmeca，巨石头像）→ 玛雅厅（Maya，帕卡尔王棺盖浮雕和玉石面具）。太阳石是高潮，别一进门就冲过去。"},
   {title:"中午：中庭「大伞」拍照，在馆内吃饭",body:"中庭只靠一根柱子撑起的混凝土大伞，四周有水落下，是最有名的拍照点。午饭可以在馆内一楼的 [[pid:ChIJGQK9g0n_0YURdh1Z2H2T-7o|Sala Gastronómica Museo Nacional de Antropología|Sala Gastronómica]] 吃，馆内不能带食物进去。"},
   {title:"下午：二楼民族展厅挑感兴趣的看",body:"二楼是现代原住民的生活和民俗，网友说时间紧可以略过，或挑几个厅看。出门后在 [[map:Bosque de Chapultepec|查普尔特佩克森林公园（Bosque de Chapultepec）]]里走走，网友说林间咖啡馆能看到很多小松鼠。",only:"stay"},
   {title:"傍晚：去 Polanco 吃晚饭，回酒店",body:"Polanco 就在博物馆旁边，餐厅看「餐厅美食」。",only:"stay"},
   {title:"中午或下午：看完回酒店",body:"网友说只看一楼的四大文明，1.5–2 小时也能逛完。",only:"back"}
  ],
  foot:"怎么去、要多久，看「路线和交通」。"
 },
 estacas:{
  options:[["back","1 天来回"],["stay","2 天 1 晚：住园区"]],
  stops:[
   {when:"第 1 天",title:"早上 7–8 点从墨城出发，前往冷水湖（Las Estacas）",body:"网友建议早点出发，周末人多，早到才能占到有树荫的位置。"},
   {title:"上午：进园、找位置、租装备",body:"[[pid:ChIJeWOnMrV-zoURY1qzrHl9gJ0|Las Estacas Parque Natural|冷水湖公园（Las Estacas Parque Natural）]]进门后要走约 5 分钟。东西多的话，门口有工作人员用小推车帮忙送，给约 100 比索小费。过桥左边是存包处，也是漂流的起点，可以租柜子、救生衣、泳圈（押金要现金）。"},
   {title:"上午到中午：从源头顺流漂",body:"一直往上游走到泉眼源头下水，源头有约 5 米的跳台；顺着水流往下漂，中游有秋千跳水，下游有索道跳水（傍晚会关）。水流比较急、踩不到底，不会游泳的一定穿救生衣。"},
   {title:"中午：野餐烧烤，或在园区餐厅吃",body:"自带食材可以烧烤，也可以在园区餐厅吃，具体看「餐厅美食」。"},
   {title:"下午：吊床区休息，玩桨板、皮划艇、浮潜",body:"Jardín Hamacas 吊床区人少安静，有免费吊床。也可以租桨板、皮划艇、船，或者带氧气瓶潜水（要会游泳）。"},
   {title:"傍晚：冲澡、还装备，出发回墨城（Ciudad de México）",body:"网友提醒 5 点前去冲澡，再晚要排长队；救生衣要在 5:30 前归还。",only:"back"},
   {when:"第 1 天",title:"晚上到家",only:"back"},
   {title:"傍晚：冲澡、还装备",body:"网友提醒 5 点前去冲澡，再晚要排长队；救生衣要在 5:30 前归还。",only:"stay"},
   {title:"晚上：住在园区里",body:"住园区酒店、小木屋或帐篷，具体看「酒店推荐」。网友说园区最晚 21 点关门，关门后进不去也出不来；晴天晚上也可能下雨，露营要做好防水。",only:"stay"},
   {when:"第 2 天",title:"上午：趁人少再漂一次",only:"stay"},
   {title:"午饭后出发回墨城（Ciudad de México）",only:"stay"},
   {when:"第 2 天",title:"晚上到家",only:"stay"}
  ],
  foot:"路上要多久、怎么坐车，看「路线和交通」。"
 },
 valq:{
  options:[["stay","2 天：连乔卢拉、普埃布拉"],["back","1 天来回"]],
  stops:[
   {when:"第 1 天",title:"早上从墨城出发，前往瓦尔基里科（Val'Quirico）"},
   {title:"上午：逛瓦尔基里科（Val'Quirico）、拍照",body:"网友建议早点到，下午 2–3 点以后人明显变多。石板路小巷、拱门、钟楼和喷泉随便走，走走停停就好，不用特别规划。"},
   {title:"中午：在小镇里吃饭",body:"网友推荐在 [[pid:ChIJPwAwsLTaz4URY1zFUvojOjs|La Route Des Vins Val Quirico|La Route Des Vins]] 吃 brunch，其他餐厅看「餐厅美食」。"},
   {title:"下午：乔卢拉（Cholula）大金字塔",body:"[[pid:ChIJZbmfJy_Gz4URgVYZhn1Y2Mg|Zona Arqueológica de Cholula|乔卢拉考古区（Zona Arqueológica de Cholula）]]：看起来像一座小山的金字塔，山顶建着黄色的 [[map:Santuario de Nuestra Señora de los Remedios Cholula|Nuestra Señora de los Remedios 教堂]]。[[link:https://lugares.inah.gob.mx/en/node/5678|INAH 官网]]：考古区周三至周日 9:00–17:00 开放，17:00 停止入场，周一、周二闭馆；外国游客门票 210 比索（2026 年 10 月查询）。有网友觉得遗址门票不太值，从外面和山顶教堂也能看到大部分景色。",only:"stay"},
   {title:"傍晚：在山顶教堂看日落",body:"教堂地势高，网友推荐来看日落；天气好时能看到 Popocatépetl 和 Iztaccíhuatl 两座火山。",only:"stay"},
   {title:"晚上：到普埃布拉（Puebla）吃饭、住宿",body:"可以尝尝这里的招牌 mole poblano（巧克力辣椒酱）。饭后去 [[pid:ChIJhwilCijGz4URxQHHgRUmIVs|Catedral de Puebla|普埃布拉大教堂（Catedral de Puebla）]] 看夜景，网友推荐晚上来拍灯光。住老城附近。餐厅和酒店之后写在普埃布拉页面。",only:"stay"},
   {when:"第 2 天",title:"上午：逛普埃布拉（Puebla）老城",body:"老城 1987 年列入世界遗产，随便走走。白天进 [[pid:ChIJhwilCijGz4URxQHHgRUmIVs|Catedral de Puebla|大教堂]] 参观（免费），它的钟楼是全墨西哥最高的。普埃布拉以 Talavera 彩绘陶瓷出名，街上可以留意。",only:"stay"},
   {title:"午饭后出发回墨城（Ciudad de México）",only:"stay"},
   {when:"第 2 天",title:"晚上到家",only:"stay"},
   {title:"下午：喝咖啡、看街头演出",body:"街上常有弦乐和歌手表演；带小孩可以玩旋转木马和摩天轮。网友提醒：别在小镇待到天黑，没开车的话很难打到车（见「路线和交通」）。",only:"back"},
   {title:"傍晚：5 点多出发去乔卢拉（Cholula）看日落",body:"到 [[pid:ChIJZbmfJy_Gz4URgVYZhn1Y2Mg|Zona Arqueológica de Cholula|乔卢拉大金字塔（Zona Arqueológica de Cholula）]]，爬上山顶的 [[map:Santuario de Nuestra Señora de los Remedios Cholula|Nuestra Señora de los Remedios 教堂]] 看日落，天气好时能看到 Popocatépetl 和 Iztaccíhuatl 两座火山。[[link:https://lugares.inah.gob.mx/en/node/5678|INAH 官网]]显示考古区 17:00 停止入场、周一周二闭馆，傍晚到的话进不了考古区；网友说不进考古区，走上山的路也能到教堂、看到全貌。教堂的开放时间官网没写，出发前核实。",only:"back"},
   {title:"晚上从乔卢拉（Cholula）回墨城（Ciudad de México）",only:"back"},
   {when:"第 1 天",title:"晚上到家",only:"back"}
  ],
  foot:"路上要多久、怎么坐车，看「路线和交通」。"
 }
};

const GUIDE={
 sma:{
  transport:[{h:"建议游玩路线：墨城 → 圣米格尔 → 瓜纳华托 → 墨城"},
   "map:loopfwd",
   "leg:a","leg:b","leg:c",
   "[[link:https://www.google.com/maps/dir/Ciudad+de+M%C3%A9xico/San+Miguel+de+Allende,+Gto./Guanajuato,+Gto./Ciudad+de+M%C3%A9xico|在 Google 地图打开这条路线导航]]",
   {h:"其他走法"},
   "也可以反方向走：墨城 → 瓜纳华托 → 圣米格尔 → 墨城，路程一样，只是先走最远的一段。",
   {h:"到了以后"},
   "到了老城基本靠走路，主要景点都在步行范围内。去 El Mirador 观景台要爬坡；Google 地图上网友说可以坐 8 路、9 路本地公交上山。",
   {src:"来源：小红书笔记「🇲🇽落地签已拍｜圣米格尔拍照及美食攻略」（@跟着巨巨走世界）；Google 地图评论。"}],
  route:[{h:"老城半天到一天的走法（小红书网友推荐顺序）"},
   "[[pid:ChIJe3LiqbBRK4QRovZrXZsp_38|Parroquia de San Miguel Arcángel|粉色教堂（Parroquia de San Miguel Arcángel）]] → 网红俯拍机位 [[pid:ChIJ27lxsVBRK4QRTytnbFrqKgQ|Hotel Boutique Casa Laja|Hotel Boutique Casa Laja]] → [[pid:ChIJ85l59a9RK4QRzdnUBrrt250|Calle Aldama San Miguel de Allende|阿尔达玛街（Calle Aldama）]] → 观景台 [[pid:ChIJp6BjRbtRK4QRkJ0Wki24fLM|El Mirador San Miguel de Allende|El Mirador]] → [[pid:ChIJK8potLlRK4QRW0eJA8PS63E|Mercado de Artesanías San Miguel de Allende|手工艺品市场（Mercado de Artesanías）]] → [[pid:ChIJ2zOCo7lRK4QRgbV9v4OA4uA|Mercado Ignacio Ramírez|本地市场（Mercado Ignacio Ramírez）]]。",
   "[[pid:ChIJp6BjRbtRK4QRkJ0Wki24fLM|El Mirador San Miguel de Allende|El Mirador]]：Google 4.6 ★（13,079 条）；有网友推荐日出，也有人推荐日落（日落前 30 分钟到）。",
   "[[pid:ChIJK8potLlRK4QRW0eJA8PS63E|Mercado de Artesanías San Miguel de Allende|手工艺品市场]]：Google 4.6 ★（8,435 条），每天 9:00–19:00；网友建议从报价的一半开始砍价，往里走价格更好、选择更多。",
   "[[pid:ChIJ-8ryLbdRK4QR_lD6t6uhTAQ|Templo de la Purísima Concepción San Miguel de Allende|黄色教堂（Templo de la Purísima Concepción）]]：Google 4.7 ★（991 条），正午光线最好，门口有一棵大树，适合拍照。",
   {h:"从墨城出发的 2–3 天路线"},"route:smagto",
   {src:"来源：小红书笔记「圣米格尔｜景点攻略大全」（@WaterKing）、「🇲🇽落地签已拍｜圣米格尔拍照及美食攻略」（@跟着巨巨走世界）；Google 地图。"}],
  food:[
   {name:"Los Milagros",q:"Los Milagros San Miguel de Allende",pid:"ChIJM-V6_LlRK4QR637OfCc5NHw",r:4.5,n:4745,price:"人均 300–400 比索（网友）",note:"招牌是石臼烤肉（Molcajete），火山石盆端上来的综合烤肉，量很大，适合几个人分。地址 Relox 17。网友提醒周六要订位。"},
   {name:"Mamá Mela",q:"Mamá Mela San Miguel de Allende",pid:"ChIJN-jzNmtRK4QRz8dbfhTh_DY",r:4.9,n:485,price:"$$",note:"只有几个座位的小店，卷饼（burrito）做好后会在铁板上再烤一下，外皮香脆。网友推荐 cochinita pibil 口味。周日休息。"},
   {name:"Tostévere",q:"Tostévere San Miguel de Allende",pid:"ChIJR0njDItRK4QR7dMmriA6Lc8",r:4.7,n:1196,price:"$$",note:"创意墨西哥小盘菜，主打 tostada 和 taco，烟熏 mezcal 鸡尾酒也有人推荐。晚餐要提前订位，午餐一般不用。"},
   {src:"来源：小红书笔记「圣米格尔好吃的餐厅🍴」、「🇲🇽落地签已拍｜圣米格尔拍照及美食攻略」；评分来自 Google 地图（2026 年 10 月）。"}],
  hotel:["下面是圣米格尔（San Miguel de Allende）老城里的酒店，用于行程第一晚。走 3 天路线的话，第二晚住瓜纳华托，那边的酒店请看瓜纳华托页面的「酒店推荐」。","Google 地图没有给出这些酒店的价格，下面按酒店类型分成三档，实际房价以预订网站为准。都在老城中心，步行可到粉色教堂。",
   {h:"圣米格尔 · 高端"},
   {name:"Rosewood San Miguel de Allende",q:"Rosewood San Miguel de Allende",pid:"ChIJAZDDMLBRK4QRS5jdni97BA0",r:4.7,n:4416,note:"顶级度假酒店，屋顶酒吧 Luna 能看粉色教堂；网友说服务非常好，屋顶酒水偏贵。"},
   {name:"Numu Boutique Hotel（Hyatt 旗下）",q:"Numu Boutique Hotel San Miguel de Allende",pid:"ChIJ__-2EbBRK4QROqwynaCuGGU",r:4.7,n:203,note:"新开的精品酒店，有屋顶泳池；有网友反映临街房间晚上有点吵。"},
   {h:"圣米格尔 · 中档精品"},
   {name:"Hotel La Morada",q:"Hotel La Morada San Miguel de Allende",pid:"ChIJk8AbBbpRK4QR-ZqI3AYaPd4",r:4.9,n:979,note:"离主广场不到一个街区，房间干净宽敞；没有电梯，没有餐厅。"},
   {name:"Hotel Boutique Casa Don Quijote",q:"Hotel Boutique Casa Don Quijote",pid:"ChIJZf22XbFRK4QR-oHeMsXp9no",r:4.6,n:479,note:"走到中心约 10 分钟，房间大，含早餐，有代客泊车，适合自驾。"},
   {h:"圣米格尔 · 经济"},
   {name:"Hotel Edén de los Ángeles",q:"Hotel Edén de los Ángeles San Miguel de Allende",pid:"ChIJY1gNjrBRK4QRM6FrP2bIAKs",r:4.3,n:231,note:"离主广场几个街区，网友说性价比高；没有空调，没有停车场。"},
   {name:"La Catrina Hostel and Breakfast",q:"La Catrina Hostel San Miguel de Allende",pid:"ChIJN4eNa7hRK4QRlzJJyToibHI",r:4.5,n:1244,note:"青旅，有多人间，屋顶露台大，24 小时前台；早餐很简单。"},
   {src:"评分来自 Google 地图（2026 年 10 月）。小红书上的圣米格尔酒店笔记大多没写酒店名字，所以这里以 Google 地图为主。"}]},
 valle:{
  transport:[{h:"建议游玩路线：墨城 → 巴耶德布拉沃 → 墨城"},
   "map:valle",
   "leg:d",
   "[[link:https://www.google.com/maps/dir/Ciudad+de+M%C3%A9xico/Valle+de+Bravo,+M%C3%A9x./Ciudad+de+M%C3%A9xico|在 Google 地图打开这条路线导航]]",
   "大巴站：墨城西站 [[pid:ChIJxa1zwtoB0oUR7t2-5krSHuQ|Central de Autobuses Observatorio|Terminal Poniente（Observatorio）]]；到达站 [[pid:ChIJtSVWXYZjzYURv7YHfffrHmo|Terminal de Autobuses Valle de Bravo|Valle de Bravo 长途车站]]。",
   {h:"到了以后"},
   "镇中心主要靠走路，但坡很多，穿运动鞋。网友说镇上很难打到 Uber；去瀑布、Avándaro 一带可以在码头附近租越野车（两人座约 800 比索起，四人座约 2,000 比索），或坐三轮摩托（mototaxi）跟向导走，有网友付了 700 比索一台。",
   "码头附近会有很多人上前推销坐船、滑翔伞、骑马、越野车，网友建议多问几家、可以砍价。",
   {src:"来源：小红书笔记「圣周逃离墨城｜2小时到Valle de Bravo」（@思Claire）、「🇲🇽｜Valle de Bravo英雄谷一日（附攻略）」（@Moni的美洲日记）、「📍Valle de Bravo｜周日」（@在北美的闽C）、「墨西哥英雄谷避雷」（@Aguamarina）、「墨西哥宝藏小镇，2天共花¥790.73」（@黛西的环游世界账本）、「墨西哥城周末游 | valle de bravo湖边小镇」（@罗毛蛋的世界）；自驾时间和距离来自 Google 地图（2026 年 10 月）。"}],
  route:[{h:"必去的地方（网友推荐）"},
   "[[pid:ChIJXZecL3lkzYURC0assyHrQhE|Embarcadero Municipal Valle de Bravo|市政码头（Embarcadero Municipal）]]坐船：Google 4.5 ★（5,846 条）。网友付过的价格：快艇半小时约 750–800 比索（最多 7 人）、1 小时约 1,200–1,500 比索；大船约 110 比索一人；也有人坐小船 30 分钟 400 比索。半小时基本够绕湖一圈。有向导说想钓鱼要早上 9 点前。",
   "[[pid:ChIJ1yzmZY5jzYURE07h19ItKe8|Mirador La Peña Valle de Bravo|拉佩尼亚观景台（Mirador La Peña）]]：Google 4.8 ★（3,969 条）。网友说门票 25 比索（州旅游局网站没写），爬 10–20 分钟，路陡，山顶是岩石没有平台，穿运动鞋。网友建议下午 4 点以后去，看日落要在 17:30 前到；也有网友觉得不太值得。",
   "滑翔伞（parapente）：网友付过 1,300–1,800 比索一人（多人可砍价），含照片视频；先坐车上山（有人说颠了半小时），飞 10–20 分钟。网友提醒：风大时整个小镇都飞不了，最好提前联系当地旅行社。",
   "[[pid:ChIJe_XMCkFkzYURy-FthBG6qiw|Cascada Velo de Novia Valle de Bravo|婚纱瀑布（Cascada Velo de Novia）]]：Google 4.7 ★（7,453 条）。从镇上开车约 20 分钟，有网友说不收门票；林间土路，可以骑马。有网友觉得瀑布一般，喜欢大自然的可以去。",
   "帝王蝶（mariposa monarca）：冬季限定，可以去 [[pid:ChIJQf6EORd5zYURcykrR-xccjE|Santuario Piedra Herrada|Piedra Herrada 帝王蝶保护区]]，Google 4.5 ★（4,399 条）。保护区没有自己的官网；墨西哥州政府和国家保护区委员会（CONANP）往年公布的观蝶季是 11 月中到 3 月底，当季的开放时间和门票出发前核实。",
   "其他可以玩的：尾波冲浪（wakeboard）、帆船、骑马、越野车（ATV）。网友说小镇的手工艺品大同小异，买个冰箱贴就够了。",
   {h:"1–2 天行程"},"route:valle",
   {src:"来源：小红书笔记「圣周逃离墨城｜2小时到Valle de Bravo」（@思Claire）、「Valle de Bravo 英雄谷 圣诞 一日游」（@当当Ashtyn）、「🇲🇽｜Valle de Bravo英雄谷一日（附攻略）」（@Moni的美洲日记）、「Valle de Bravo第二次来英雄谷，这次带对象！」（@墨城吃货）、「英雄谷两天一夜」（@Sritayue）、「【墨西哥】-英雄谷Valle de Bravo-Mirador La」（@闯荡的Charles）、「🇲🇽跨年长假·逃出墨城的那几天✨」（@甜甜）、「墨西哥英雄谷避雷」（@Aguamarina）；评分来自 Google 地图（2026 年 10 月）。"}],
  food:["网友说这里的餐厅选择不算多，整体价格偏高，旺季和假期更明显。本地特色是烤鳟鱼（trucha）。",
   {name:"Soleado Cocina del mundo",q:"Soleado Cocina del mundo Valle de Bravo",pid:"ChIJP-QGQn9kzYURwO0rhVcGB2k",r:4.5,n:1044,price:"人均 200–500 比索（Google）",note:"湖边半山腰、景色很好的餐厅，有地中海、亚洲、墨西哥等各地风味。网友推荐鲜榨果汁、烤牛肉和甜品；鱼肉 taco 不推荐。"},
   {name:"La Machincuepa Valle",q:"LA MACHINHUEPA VALLE Valle de Bravo",pid:"ChIJ8dszX39kzYURihlETdxvatU",r:4.5,n:485,price:"人均 200–300 比索（Google）",note:"咖啡店。网友说氛围好、景色很棒、装修漂亮，饮料不错，人不多。"},
   {name:"Almatierra",q:"Almatierra Valle de Bravo",pid:"ChIJQ9cy7u1kzYURcWAtNfq47E0",r:4.5,n:272,price:"人均 200–300 比索（Google）",note:"在阿万达罗（Avándaro）。网友说环境舒服、气氛放松，适合吃早餐或下午坐坐。"},
   {name:"Restaurante los Pericos",q:"Restaurante los Pericos Valle de Bravo",pid:"ChIJk6JJMHlkzYURxFUUh9H_JP4",r:4.4,n:5037,price:"人均 200–500 比索（Google）",note:"建在湖上的船餐厅，在码头旁边，当地人推荐过。网友说菜的种类多、上菜快，味道不惊艳也不难吃；餐厅会一直轻轻摇晃，容易晕的注意。"},
   {name:"Club de Vela Santa María",q:"Club de Vela Santa María Valle de Bravo",pid:"ChIJCRigU3xkzYURTgji0cgx-l8",r:4.5,n:288,note:"帆船俱乐部，外观像城堡，也能住宿。网友说食物还行，重点是风景和欧式复古的风格。"},
   {name:"Restaurante Bar Paraíso",q:"Restaurante Bar Paraíso Valle de Bravo",pid:"ChIJWQam0XhkzYURa1tUj4UJzk0",r:4.3,n:1260,price:"人均 200–300 比索（Google）",note:"码头边的餐厅，可以坐窗边吹湖风。网友说风景不错，食物味道一般。"},
   {name:"La Michoacana",q:"La Michoacana Valle de Bravo",pid:"ChIJdyUKo4BjzYURw7meNasj1dk",r:4.4,n:2153,price:"人均 200–600 比索（Google）",note:"镇中心。网友说菜品一般，主要是拍照，实景没有 Google 上的图片好看。"},
   {name:"Degustando Avandaro",q:"Degustando Avandaro Valle de Bravo",pid:"ChIJ_8mp3vVkzYUROESCP5CFbmc",r:4.4,n:371,note:"西班牙 / 地中海菜，在阿万达罗（Avándaro）。网友说还行，但价格贵、份量小。"},
   {h:"市场"},
   "[[pid:ChIJZZI3BYdjzYURpEu6uBntuos|Mercado Municipal Valle de Bravo|市场（Mercado Municipal）]]：Google 4.2 ★（2,214 条）。网友说水果又好吃又便宜（菠萝、木瓜、西柚），一定要带现金。住民宿的话也可以来买菜自己做饭。",
   {src:"来源：小红书笔记「🇲🇽跨年长假·逃出墨城的那几天✨」（@甜甜）、「🇲🇽｜Valle de Bravo英雄谷一日（附攻略）」（@Moni的美洲日记）、「墨西哥宝藏小镇，2天共花¥790.73」（@黛西的环游世界账本）、「Valle de Bravo 英雄谷 圣诞 一日游」（@当当Ashtyn）、「墨西哥英雄谷避雷」（@Aguamarina）、「墨西哥城周末游 | valle de bravo湖边小镇」（@罗毛蛋的世界）、「📍Valle de Bravo｜周日」（@在北美的闽C）、「圣周逃离墨城｜2小时到Valle de Bravo」（@思Claire）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
  hotel:["下面是走「2 天 1 晚」路线时住的地方。网友的建议：想安静放松，住阿万达罗（Avándaro）森林一带，那边民宿、木屋和带壁炉的别墅多；想走路逛镇子、不用找停车位，住镇中心。周末和假期房价会涨，工作日去更便宜。","Google 地图没有给出这些酒店的价格，下面按酒店类型分成三档，实际房价以预订网站为准。",
   {h:"巴耶德布拉沃 · 高端"},
   {name:"Hotel Avándaro Golf & Spa Resort",q:"Hotel Avándaro Valle de Bravo",pid:"ChIJyd4mXFtkzYURBuZXH2Wb4WM",r:4.6,n:1964,note:"Google 标为四星，在阿万达罗（Avándaro），有泳池、高尔夫球场和 spa。网友说位置和设施很好，自助餐能看到泳池和球场；没有车的话基本出不去（前台可以叫出租车）；也有人觉得服务配不上价格。"},
   {name:"El Lugar Del Que Te Hablé Hotel Boutique",q:"El Lugar Del Que Te Hablé Hotel Boutique",pid:"ChIJfdf4OLhlzYURF38X52Fmqkg",r:4.6,n:71,note:"Google 标为五星，在阿万达罗（Avándaro）。小红书网友跨年住过：房间干净、有设计感，住了几晚都很安静放松。"},
   {h:"巴耶德布拉沃 · 中档精品"},
   {name:"Hotel La Batucada",q:"Hotel La Batucada Valle de Bravo",pid:"ChIJ_5Ts04BjzYUR33Yr_QFJD-8",r:4.6,n:343,note:"在镇中心，走路就能逛全镇；有泳池。网友说建筑漂亮、员工热情，酒店餐厅的早餐评价很好（也有小红书网友觉得餐厅环境不错、食物一般）；临主街。"},
   {name:"Hanna Hotel Boutique",q:"Hanna Hotel Boutique Valle de Bravo",pid:"ChIJKXEoBABjzYURbS8cGuNm9zo",r:4.5,n:59,note:"离镇中心几个街区，在山坡上，进出要爬坡。网友说房间大、阳台景色好、早餐好，有按摩服务。"},
   {h:"巴耶德布拉沃 · 经济"},
   {name:"Hostal el Alebrije",q:"Hostal el Alebrije Valle de Bravo",pid:"ChIJPYs9_mVlzYUR84zVUEZBrhU",r:4.7,n:210,note:"镇中心的青旅，有私人间，屋顶看得到风景。网友说老板 Alfonso 很热心，住着像在家一样。"},
   "也可以在 Airbnb 订湖边或山里的木屋。网友提醒：山里的木屋可能断网、停电，夜里很冷，要带厚衣服。",
   {src:"来源：小红书笔记「🇲🇽跨年长假·逃出墨城的那几天✨」（@甜甜）、「圣周逃离墨城｜2小时到Valle de Bravo」（@思Claire）、「墨西哥宝藏小镇，2天共花¥790.73」（@黛西的环游世界账本）、「Valle de Bravo📍 La Batucada Restaurante」（@lili小肥象）、「🇲🇽墨城周末 ｜花钱在山间小屋充（买）电（罪）」（@一朵钟翠花er）；Hotel Avándaro、La Batucada、Hanna 和 Alebrije 参考 Google 地图评论。评分来自 Google 地图（2026 年 10 月）。"}]},
 valquirico:{
  transport:[{h:"建议游玩路线：墨城 → 瓦尔基里科 → 乔卢拉 → 普埃布拉 → 墨城"},
   "map:valq",
   "leg:e","leg:f","leg:g","leg:h",
   "[[link:https://www.google.com/maps/dir/Ciudad+de+M%C3%A9xico/Val'Quirico,+Tlax./Zona+Arqueol%C3%B3gica+de+Cholula/Catedral+de+Puebla/Ciudad+de+M%C3%A9xico|在 Google 地图打开这条路线导航]]",
   "大巴站：墨城 [[map:Miyana Polanco|Miyana Polanco（e-bus 上下车点）]]、[[map:Terminal de Autobuses de Pasajeros de Oriente TAPO|东站 TAPO]]；普埃布拉 [[map:Terrapuerto Paseo Destino Puebla|Paseo Destino]]、[[map:CAPU Central de Autobuses de Puebla|CAPU]]。不开车的话，也可以去程坐大巴到普埃布拉，再打车去小镇（网友说约 30–40 分钟）。",
   {h:"注意"},
   "有网友没开车，在小镇逛到傍晚 6:30 才走，外面是荒地、手机没信号、打不到车，走了很久夜路。没开车的话要提前和司机谈好回程，天黑前离开。",
   {src:"来源：小红书笔记「🇲🇽Val'Quirico小镇｜CDMX周末放松一日游」（@一颗梨涡圆）、「墨城出发2h！超绝意大利风情小镇日游🇮🇹」（@喝水长的高）、「🇲🇽墨西哥Val'Quirico小镇回城惊魂记」「🇲🇽墨西哥Val'Quirico绝美小镇」（@Dreama自由行）、「🇲🇽Val'Quirico小镇✨｜CDMX周边游」（@Noris&）、「墨西哥城🇲🇽自驾1小时可达小镇Val’Quirico」（@左迷藏🙈）、「墨西哥城周末限定快乐📍Val'Quirico」（@小lee）、「墨城周边Val'Quirico意大利小镇半日游」（@Coralita）；自驾时间和距离来自 Google 地图（2026 年 10 月）；普埃布拉大巴参考 ebus.mx 和 rome2rio 路线网站（2026 年 10 月）。"}],
  route:[{h:"玩什么（网友推荐）"},
   "[[pid:ChIJYVOeO0vFz4URCv8vgQF-y7I|Val'Quirico|瓦尔基里科（Val'Quirico）]]：Google 4.6 ★（39,431 条）。免费进入，是 2014 年建成、模仿意大利托斯卡纳（Toscana）风格的人造小镇。网友说不用做攻略，主要就是随便逛、吃饭、拍照。要逛多久说法不一：只走一圈约 1 小时；加上吃饭、喝咖啡、逛店 3–4 小时；慢慢待可以待半天。网友说商铺和餐厅大多 10:00–20:00 营业，周末人最多；官网没有写开放时间、门票和停车费（2026 年 10 月查询）。",
   "拍照：石板路、石头拱门、彩色木门、挂满花的阳台、喷泉雕塑，网友说随便一个转角都好拍。节日前后墙上会挂满国旗。",
   "逛店：服装、饰品、香薰、画廊和甜品店都有；也有网友说里面的纪念品大多是批发货，不推荐专门逛。",
   "带小孩：有吊床、旋转木马和摩天轮。有网友去了后面的跑马场骑马，马厩里可以挑马；她 9 月去的时候后院有一大片薰衣草在开花。",
   "网友提醒：穿舒服的鞋，石板路走久了硌脚。",
   {h:"顺路可以去"},
   "普埃布拉（Puebla）老城：建议把 Val'Quirico 当第一站，乔卢拉（Cholula）第二站，晚上再去普埃布拉。",
   "乔卢拉（Cholula）：大金字塔顶上的教堂 [[map:Santuario de Nuestra Señora de los Remedios Cholula|Santuario de Nuestra Señora de los Remedios]] 地势高，网友推荐看日落，天气好能看到两座火山。",
   "特拉斯卡拉（Tlaxcala）老城：[[map:Palacio de Gobierno Tlaxcala|特拉斯卡拉州政府宫（Palacio de Gobierno）]]的壁画和教堂。网友说这里安静、有生活气息，和 Val'Quirico 很近，可以排在同一天。",
   {h:"1–2 天行程"},"route:valq",
   {src:"来源：小红书笔记「🇲🇽Val'Quirico小镇｜CDMX周末放松一日游」（@一颗梨涡圆）、「墨城出发2h！超绝意大利风情小镇日游🇮🇹」（@喝水长的高）、「🇲🇽Val'Quirico小镇✨｜CDMX周边游」（@Noris&）、「墨西哥puebla三日游之val quirico 小镇」（@小雪儿）、「墨西哥从Valquirico童话世界穿越到历史小镇」（@流浪地球的小臭啊猪🐷）、「墨西哥🇲🇽Puebla及周边游攻略」（@Sol昭屿禾）、「🇲🇽墨城｜这周末在哪里？」（@娜懒得解释）、「墨西哥城🇲🇽自驾1小时可达小镇Val’Quirico」（@左迷藏🙈）、「Val’Quirico | 墨西哥小镇」（@奥斯陆一级葱师）；乔卢拉、普埃布拉的内容来自这两个地点页面的简介；评分来自 Google 地图（2026 年 10 月）。"}],
  food:["网友说小镇里餐厅很多：墨西哥菜、意大利菜、西班牙菜、日料，还有咖啡馆和冰淇淋店；有网友说随便选也没踩雷。小红书上写到具体店名的不多，下面除了 La Route Des Vins，主要参考 Google 地图评论。",
   {name:"La Route Des Vins",q:"La Route Des Vins Val Quirico",pid:"ChIJPwAwsLTaz4URY1zFUvojOjs",r:4.4,n:2872,note:"小红书网友推荐的法式 brunch：直接进去没订位，小面包好吃，美式咖啡可以免费续杯，价格也合适。Google 上也有网友说早餐好；人多时服务会慢。"},
   {name:"La Luna Sul Mare",q:"La Luna Sul Mare Val'Quirico",pid:"ChIJXZUssbTaz4URw99sTxxzDeo",r:4.4,n:1837,price:"人均 300–800 比索（Google）",note:"意大利菜。网友推荐海鲜意面和三文鱼薄片（carpaccio）；披萨饼底好，但有人觉得配料一般。"},
   {name:"Mesón de los Reyes",q:"Mesón de los Reyes Val'Quirico",pid:"ChIJNbSotrTaz4URMeyJHSDxAdI",r:4.4,n:2903,note:"网友推荐 pasilla 辣椒的玉米片（chilaquiles de pasilla）、海鲜饭（paella）和整只烤猪；有演出时这里视野最好，还有钢琴演奏。也有好几位网友说服务差、上错菜，牛排一般。"},
   {name:"Casa Tlaxcala",q:"Casa Tlaxcala Val'Quirico",pid:"ChIJZcvf9gPbz4URZ84MtDF1rQ8",r:4.6,n:53,price:"人均 300–700 比索（Google）",note:"网友说早餐很好，环境漂亮。推荐普埃布拉砂锅（cazuela poblana）、红酱玉米片（chilaquiles rojos）、配腌牛肉（cecina）的玉米饼（tlacoyos）和辣酱炖猪肘（chamorro en adobo）。"},
   {name:"Chohuetlán",q:"Chohuetlán Val'Quirico",pid:"ChIJxWyl2gbbz4URXjC7J1WWvxs",r:4.5,n:1628,price:"人均 200–800 比索（Google）",note:"网友多是来吃早餐，说服务好、环境舒服；味道不错但不算惊艳。有网友周六早上来，店里几乎没人。"},
   {name:"La Encomienda",q:"La Encomienda Valquirico",pid:"ChIJR6hoqNnFz4URsmdOwpD2jYQ",r:4.6,n:357,note:"烤肉餐厅。网友说环境好、服务员热情；也有网友觉得菜还行、不特别，服务员很久不来。"},
   {src:"来源：小红书笔记「墨西哥🇲🇽Puebla及周边游攻略」（@Sol昭屿禾）、「🇲🇽Val'Quirico小镇｜CDMX周末放松一日游」（@一颗梨涡圆）、「藏在墨西哥🇲🇽里的浪漫小镇🌸」（@乙鱼侍尾）；其余参考 Google 地图评论。评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
  hotel:["走「2 天」路线的话，晚上住普埃布拉（Puebla）老城附近，那边的酒店之后写在普埃布拉页面。下面是想直接住在 Val'Quirico 小镇里的选择。小镇里就有酒店，价格网友说法不一：有人说比较贵，也有人说实惠。也有网友住在乔卢拉（Cholula），去周边都方便。车要停在小镇入口对面的停车场，Google 上网友说好几家酒店会派高尔夫球车或班车到停车场接人。","Google 地图没有给出固定房价，下面按酒店类型分成三档，实际房价以预订网站为准。",
   {h:"瓦尔基里科 · 高端"},
   {name:"Hotel Pietro Santo Valquirico",q:"Hotel Pietro Santo Valquirico",pid:"ChIJhbhm5N7bz4UR-hziRyzOXM8",r:4.6,n:175,note:"Google 标为四星，在小镇里。网友说装修很有感觉、员工服务好；去房间要爬一段很陡的楼梯，大行李箱要小心；有网友反映热水和水压不稳定，价格不便宜。"},
   {h:"瓦尔基里科 · 中档精品"},
   {name:"Villa Toscana Lofts & Suites",q:"Villa Toscana Lofts & Suites Val'Quirico",pid:"ChIJWSqWxn3Qz4URz_SPAH7L2GQ",r:4.6,n:228,note:"在小镇里。网友说到了以后有高尔夫球车来车边接、帮拿行李，员工很热情。Google 标注含早餐、免费停车。"},
   {name:"La Bella Toscana Hotel \"Centro\"",q:"La Bella Toscana Hotel Centro Val'Quirico",pid:"ChIJLRlBbpzbz4URpycAD7oFL_c",r:4.4,n:24,note:"在小镇里。网友说有班车往返停车场，停车费含在房价里；房间宽敞干净，在酒吧消费打九折；房间没有熨斗。"},
   {h:"瓦尔基里科 · 经济"},
   {name:"Hotel Canaria",q:"Hotel Canaria Val'Quirico",pid:"ChIJk47yt7Taz4URXiZ3jnH3VXA",r:4.5,n:128,note:"Google 标为二星，在小镇里。网友说房间干净舒适、热水足、阳台景色好，有班车往返停车场。"},
   "也可以住小镇外面：[[pid:ChIJt69JCBbFz4URRCcrLGw9Erw|Ramada Encore by Wyndham Puebla|Ramada Encore by Wyndham Puebla]]，Google 4.6 ★（2,479 条），Google 标为四星，有泳池和免费停车，在小镇南边，需要开车过去。",
   {src:"来源：小红书笔记「藏在墨西哥🇲🇽里的浪漫小镇🌸」（@乙鱼侍尾）、「墨西哥🇲🇽🇮🇹意大利小镇Val’Quirico」（@妮妮）、「🇲🇽墨城｜这周末在哪里？」（@娜懒得解释）、「墨西哥🇲🇽Puebla及周边游攻略」（@Sol昭屿禾）；各家酒店的评价参考 Google 地图评论。评分来自 Google 地图（2026 年 10 月）。"}]},
 gto:{
  transport:[{h:"建议游玩路线：墨城 → 圣米格尔 → 瓜纳华托 → 墨城"},
   "map:loopfwd",
   "leg:a","leg:b","leg:c",
   "[[link:https://www.google.com/maps/dir/Ciudad+de+M%C3%A9xico/San+Miguel+de+Allende,+Gto./Guanajuato,+Gto./Ciudad+de+M%C3%A9xico|在 Google 地图打开这条路线导航]]",
   {h:"其他走法"},
   "也可以反方向走：墨城 → 瓜纳华托 → 圣米格尔 → 墨城，路程一样，只是先走最远的一段。"],
  route:"route:smagto",
  food:[
   {name:"Costal Cultura Cafetera",q:"Costal Cultura Cafetera Guanajuato",pid:"ChIJlWsedsJ1K4QRcKCEcf9IMCQ",r:4.6,n:519,price:"人均 300–600 比索（Google）",note:"两篇小红书笔记都推荐，有网友连吃两天说每道都不踩雷。推荐炖牛排和店里的特色阿兹特克汤（sopa azteca），人少时可以坐露台。网友提醒：菜单价不含税，结账另加 16% IVA。"},
   {name:"Restaurante Casa Mercedes",q:"Restaurante Casa Mercedes Guanajuato",pid:"ChIJj61QVXJ0K4QReaUZBUrF1vc",r:4.7,n:821,price:"人均 400–1,000 比索（Google）",note:"半山腰上的墨西哥式精致餐厅（fine dining），网友推荐点套餐（prefix menu）。玉米蛋糕被夸得最多，猪五花（braised pork belly）也不错；也有网友觉得鸭肉 taco、玉米蘑菇汤一般。"},
   {name:"Santo Café",q:"Santo Café Guanajuato",pid:"ChIJ51sfifhzK4QR9KVVM41Z4fk",r:4.4,n:4525,price:"人均 100–200 比索（Google）",note:"网友说每道菜份量都很大，一人点一道主菜加一杯饮料就够。"},
   {name:"La Clave Azul Restaurante Taberna",q:"La Clave Azul Guanajuato",pid:"ChIJxbPOkgh0K4QRRFXh_4OSbuk",r:4.5,n:714,price:"人均 200–300 比索（Google）",note:"藏在小巷深处的老楼，没有菜单，点了饮料后一轮轮上小菜（类似 tapas），网友说 4 道小菜加 2 杯饮料约 300 比索。建议慢慢吃、人多去能吃到后面的肉菜；也有网友觉得味道一般，主要是体验特别。"},
   {name:"Tacos \"El Paisa II\"",q:"Tacos El Paisa II Guanajuato",pid:"ChIJOcxiNg90K4QRd1nJIH5xLLQ",r:4.4,n:2279,price:"人均 100–200 比索（Google）",note:"两篇笔记都推荐的平价 taco 店，坐满本地人，网友说一个 taco 约 22 比索。门口的果汁水（agua fresca）每天口味不同，网友推荐洛神花（Jamaica）和仙人掌汁。营业 11:00–23:00（网友）。"},
   {name:"Los Huacales",q:"Los Huacales Guanajuato",pid:"ChIJr2OlQwlzK4QRGMeT2vJnXcc",r:4.5,n:1741,price:"人均 100–200 比索（Google）",note:"网友推荐汤和绿酱卷饼（Enchiladas con salsa verde），摆盘特别；也有网友觉得口味一般。"},
   {name:"Mestizo",q:"Mestizo Guanajuato",pid:"ChIJE3W27gh0K4QRtnupRJbkAXQ",r:4.4,n:611,price:"只收现金（网友）",note:"网友推荐蘑菇玉米黑粉菌（huitlacoche）汤和炸牛肚 taco。"},
   {h:"市场小吃"},
   "[[pid:ChIJjQ2UmiZ1K4QR5PxTzOrPqvU|Mercado Hidalgo Guanajuato|Mercado Hidalgo]]：Google 4.5 ★（8,186 条）。一楼有好几家海鲜汤（caldo de mariscos）摊，网友建议挑人多的吃；有网友推荐 Mariscos La Playa（一碗约 120 比索，量足）。有网友在市场吃完摊位后食物中毒，肠胃敏感的注意。",
   {src:"来源：小红书笔记「瓜纳华托餐厅推荐🍽️」（@喜欢橙色的azul女孩）、「瓜纳华托餐厅给到夯！」（@土豆花花）、「瓜纳华托必吃榜！！」（@阿远阿远）、「瓜纳华托｜美食测评：大排长队的居然是中餐」（@WaterKing）、「瓜纳华托这家巷弄小馆没有菜单，本地人至爱」（@一只薄荷瓜的生活）、「🇲🇽瓜纳华托｜吃住篇」（@RunRun跑得快）、「瓜纳华托平价taco餐厅」（@小柴胡）、「墨西哥Guanajuato 瓜纳华托美食和酒店推荐」（@红薯儿）、「【瓜纳华托】餐厅测评—— casa Mercedes」（@温柔铠甲是苹果味的）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
  hotel:["下面是瓜纳华托（Guanajuato）的酒店，用于 3 天路线的第二晚（第一晚住圣米格尔，看圣米格尔页面的「酒店推荐」）。走 2 天路线当晚开回墨城的话不用住。","Google 地图没有给出这些酒店的价格，下面按酒店类型分成三档，实际房价以预订网站为准。网友提醒：市中心的酒店大多有点吵；普雷萨大道（Paseo de la Presa）一带更安静，但离老城中心远一些。",
   {h:"瓜纳华托 · 高端"},
   {name:"Hotel Villa María Cristina",q:"Hotel Villa María Cristina Guanajuato",pid:"ChIJvZYpqqK6LIQRemjsbCsqKhU",r:4.6,n:779,note:"Google 标为五星酒店，在普雷萨大道（Paseo de la Presa）。网友说建筑和庭院很漂亮、有老派韵味，早餐好，员工很周到。"},
   {name:"Hotel Boutique Corazón Mexicano",q:"Hotel Boutique Corazón Mexicano Guanajuato",pid:"ChIJYXTUTfZxK4QRvmq38E99EeU",r:4.6,n:104,note:"小红书网友非常推荐：殖民复兴风格的老宅，房间是现代简约风，有 spa。没有电梯（酒店有人帮提行李）。离市中心约 5 分钟车程，节假日打车可能要等 10 分钟以上。"},
   {h:"瓜纳华托 · 中档精品"},
   {name:"El Mesón de los Poetas",q:"El Mesón de los Poetas Guanajuato",pid:"ChIJVetNZwh0K4QRTrOIPFRSNRs",r:4.7,n:1215,note:"在老城 Positos 街。网友说酒店有 200 年历史，像一座城堡，里面像迷宫，会迷路。"},
   {name:"Antigua Trece",q:"Antigua Trece Guanajuato",pid:"ChIJtf3HcXN1K4QRGX14lUTvG-o",r:4.3,n:326,note:"网友说有中空庭院，离 Pípila 观景台很近，推门就能看到彩色房子，房间有空调；这位网友住的时候约 100 多美元一晚。"},
   {name:"Hotel Indigo Guanajuato（IHG 旗下）",q:"Hotel Indigo Guanajuato",pid:"ChIJe7eLVQ50K4QRSvdcvKpiXy8",r:4.6,n:652,note:"两篇小红书笔记都住过：在平路上，打车进出方便，附近有超市和小吃摊，步行到市中心 10–20 分钟。一位说房间大、晚上不吵，另一位说临街房间不太隔音；前台讲英文。"},
   {h:"瓜纳华托 · 经济"},
   {name:"Casa Lupita Homestay",q:"Casa Lupita Homestay Guanajuato",pid:"ChIJRXDGG_hzK4QRREf3QSCsUck",r:4.6,n:208,note:"就在老城中心，有私人间和多人间；网友说位置非常中心，员工讲英文，房间里有独立卫生间。"},
   {name:"Hostal Casa de Dante",q:"Hostal Casa de Dante Guanajuato",pid:"ChIJnfMHnf9zK4QRTDhHulrRErQ",r:4.5,n:374,note:"在普雷萨大道（Paseo de la Presa）附近。网友说老板很热情、早餐很好吃、房间性价比高，容易和其他客人交朋友。"},
   {src:"来源：小红书笔记「20260214瓜纳华托酒店」（@尤荷）、「Guanajuato 酒店」（@Wondering）、「🇲🇽墨西哥｜亡灵节酒店分享&避雷」（@mindy_jy）、「🇲🇽瓜纳华托｜吃住篇」（@RunRun跑得快）、「墨西哥Guanajuato 瓜纳华托美食和酒店推荐」（@红薯儿）；Villa María Cristina 和两家经济型住宿参考 Google 地图评论。评分来自 Google 地图（2026 年 10 月）。"}]},
 puebla:{
  food:["普埃布拉（Puebla）是有名的美食城市。网友推荐一定要尝的：mole poblano（几十种香料熬的酱，带一点甜，常配鸡肉或火鸡）、cemita（芝麻面包夹炸肉排、牛油果和拉丝的瓦哈卡奶酪，很大一个）、chalupas（小玉米饼淋红绿酱）。网友说这里吃饭明显比墨城便宜。",
   {name:"Mural de los Poblanos",q:"Mural de los Poblanos Puebla",pid:"ChIJw7vKau7Az4URLFJUKhx8-Ps",r:4.6,n:11661,price:"人均 300–900 比索（Google）",note:"老城里的传统普埃布拉菜。网友推荐 Chalupas Poblanas 和 mole 拼盘（Degustación de Moles），一份能尝好几种 mole。Google 上网友说服务周到、上菜快。"},
   {name:"El Güero Marinero",q:"El Güero Marinero Puebla",pid:"ChIJ9Z9GRGvBz4URJYgCy8m3D5E",r:4.8,n:2404,price:"人均 200–700 比索（Google）",note:"小红书上被推荐最多的一家，现代装修的海鲜店，小盘菜（tapas）形式，网友建议每人点三四道。推荐软壳蟹 taco、椰子虾、烤章鱼和 ceviche；酱整体偏辣。有网友两人加酒约 1,000 比索。Google 上网友说常要排队。"},
   {name:"NUNI Restaurant",q:"NUNI Restaurant Puebla",r:4.7,n:280,price:"人均 200–600 比索（Google）",note:"创意餐厅，把本地食材和现代做法结合，网友说颜值和味道都在线。Google 上有网友推荐番石榴 mole 配饺子。"},
   {name:"El Maestro Asador",q:"El Maestro Asador Puebla",pid:"ChIJjSQUEe_Az4UR209zXG4r8fk",r:4.5,n:1637,price:"人均 200–600 比索（Google）",note:"1980 年开业的炭烤肉老店，本地家庭常来聚餐。网友推荐配洋葱干辣椒酱和牛油果酱，小瓶葡萄酒价格合理。"},
   {name:"Cemitas y Tortas La Poblanita",q:"Cemitas y Tortas La Poblanita Puebla",pid:"ChIJ9bsYgejAz4URQQxodmAyWMc",r:4.3,n:2172,price:"人均 100–200 比索（Google）",note:"吃 cemita 的店。网友点了炸牛排（Milanesa de Res）口味，夹芝士、牛油果和本地香草 pápalo。"},
   {name:"Gorditería de la 8",q:"Gorditeria de la 8 Puebla",pid:"ChIJqZXNI-TAz4URCkJ0HlotXeU",r:4.6,n:1102,price:"人均 100 比索以内（Google）",note:"平价 gordita（厚玉米饼）小店。网友推荐牛肉和南瓜花两种馅，记得加瓦哈卡奶酪。"},
   {name:"San Jorgito",q:"San Jorgito Puebla",pid:"ChIJyeuGG1DBz4URtP1ilHNwT7w",r:4.7,n:518,price:"人均 200–300 比索（Google）",note:"藏在老巷子里的小店，绿植多、很放松，适合早餐或下午茶。网友推荐开放式三明治和橙子气泡水。"},
   {h:"小吃和咖啡"},
   "Taco árabe：普埃布拉本地版的烤肉卷，饼和馅都和普通 taco 不一样，网友推荐尝尝。也可以喝 champurrado（巧克力玉米糊）或 pulque（龙舌兰发酵饮料）。",
   "[[map:Pozolería Matamoros Puebla|Pozolería Matamoros]]：网友推荐的玉米炖肉汤（pozole），分白、红、绿三种汤，量很大，适合当正餐。[[map:Panadería La Princesa Puebla|Panadería La Princesa]]：离主广场不远的面包店，网友推荐奶酪馅的 Cubilete。",
   "[[map:Museo Amparo Puebla|Museo Amparo]] 顶楼咖啡馆：网友说能看到好几座教堂的穹顶，跟前台说去咖啡馆就不用买门票。[[link:https://museoamparo.com/visita|官网]]：周三至周一 10:00–18:00（周二闭馆），门票 85 比索，周日和节假日免费；官网把博物馆咖啡馆列为免费进入（2026 年 10 月查询）。",
   {src:"来源：小红书笔记「🇲🇽墨城出发Puebla+Cholula一日游攻略」（@麻麻咪呀）、「墨西哥Puebla」（@爱土豆呀！！）、「墨西哥城/Puebla美食记录」（@mq）、「Puebla 一日游流水游记」（@大小姐驾到）、「墨西哥圣诞游 - Puebla和Cholula」（@屏蔽亲友团qaq）、「Puebla普埃布拉慢节奏闲逛指南🇲🇽」（@喝水长的高）、「普埃布拉的老牌牛排餐厅」（@大胡子喝酒）、「Puebla这家Gorditas没我推荐你遇不到😁」（@RinoZhang）、「普埃布拉超绝下午茶！San Jorgito~」（@珊珊）、「🇲🇽Puebla普埃布拉地道本地人科普攻略」（@糯米味Diana）、「Puebla, Mexico 美食」（@Jeanne）、「普埃布拉🇲🇽｜超绝大教堂机位，被我找到了⛪️」（@叫我黛西就好）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
  hotel:["走「2 天」路线时，第一晚住普埃布拉（Puebla）老城附近，晚上可以走路去大教堂看夜景。网友说这里的酒店和餐厅质量不错，价格大概是美国的一半。","Google 地图没有给出固定房价，下面按酒店类型分成三档，实际房价以预订网站为准。",
   {h:"普埃布拉 · 高端"},
   {name:"Banyan Tree Puebla",q:"Banyan Tree Puebla",pid:"ChIJR_RL2uTAz4URdRBr0dNhzDc",r:4.7,n:2078,note:"Google 标为五星，在老城。小红书评价两极：有网友很喜欢中庭泳池、摩洛哥风格砖墙、早餐和服务，晚上能在屋顶餐厅看教堂灯光；也有网友说毛巾旧、服务时好时坏，觉得配不上价格。"},
   {h:"普埃布拉 · 中档精品"},
   {name:"Hotel Casa del Milagro",q:"Hotel Casa del Milagro Puebla",pid:"ChIJJ27UgB7Bz4URlwhHEayBeY8",r:4.4,n:336,note:"Google 标为四星，在老城 Calle 4 Norte。网友说是 18 世纪殖民时期老宅改建，每间房以普埃布拉一个老街区命名；一楼是开了 65 年以上的老咖啡馆 Café Aguirre；前台很热情。"},
   {name:"Hotel El Descanso Barrio del Artista",q:"Hotel el Descanso Puebla Barrio del artista",pid:"ChIJXRiNqW7Bz4UR9y63T5yNJkQ",r:4.3,n:171,note:"在老城艺术家街区（Barrio del Artista）。网友说是 18 世纪巴洛克老宅改建，庭院满是绿植，有宽敞的屋顶平台。"},
   {name:"Holiday Inn Puebla La Noria（IHG 旗下）",q:"Holiday Inn Puebla la Noria",pid:"ChIJ2QvOjsK4z4UR8RMv2_vTkdw",r:4.5,n:4912,note:"Google 标为四星，不在老城，在 La Noria 一带，要打车进老城。网友说早上拉开窗帘就能看到 Popocatépetl 火山。"},
   {h:"普埃布拉 · 经济"},
   {name:"Hostal Casa de Arcos",q:"Hostal Casa de Arcos Puebla",pid:"ChIJ__8bm8LAz4URyDoYWrmeVAw",r:4.3,n:190,note:"Google 标为二星，离主要景点近。网友说干净、晚上安静，有简单的厨房，院里有披萨店；也有人说员工不太热情、WiFi 时好时坏。"},
   {src:"来源：小红书笔记「🇲🇽Puela｜藏在西班牙老城区的宝藏酒店」（@低调的李里奥）、「Banyan Tree Puebla」（@迹飞宿）、「普埃布拉历史老宅酒店体验」「普埃布拉酒店推荐」（@大胡子喝酒）、「墨西哥🇲🇽 | PUEBLA攻略」（@阿根廷的一只张十一）、「墨西哥圣诞游 - Puebla和Cholula」（@屏蔽亲友团qaq）；Hostal Casa de Arcos 参考 Google 地图评论。评分来自 Google 地图（2026 年 10 月）。"}]},
 cholula:{
  food:["乔卢拉（Cholula）镇上咖啡馆和餐厅很多，网友说物价便宜。有网友在金字塔山脚吃了路边摊后闹肚子，肠胃敏感的建议找干净的馆子。下面除了 Ciudad Sagrada 和 Atracadero，主要参考 Google 地图评论。",
   {name:"Ciudad Sagrada",q:"Ciudad Sagrada Cholula",pid:"ChIJlWwfeS_Gz4URshbtNVLMfZU",r:4.6,n:6120,price:"人均 300–700 比索（Google）",note:"网友说庭院花园很漂亮、食材好。Google 上网友说是乔卢拉比较高档的一家，能看到金字塔和山顶教堂。"},
   {name:"Atracadero",q:"Atracadero Cholula",pid:"ChIJRc3T7CXGz4UR2rCEMNfANVs",r:4.6,n:740,price:"人均 200–300 比索（Google）",note:"海鲜店。网友推荐海鲜塔（章鱼、牛油果、金枪鱼、虾和黄瓜）。Google 上也有人推荐 tacos gobernador。"},
   {name:"Santoua Cholula",q:"Santoua Cholula",pid:"ChIJi5WDt-jHz4URZ_v2xLnvec4",r:4.9,n:5171,price:"人均 200–600 比索（Google）",note:"Google 上评分很高，网友说菜好吃、服务特别周到。"},
   {name:"Amalia Cholula",q:"Amalia Cholula",pid:"ChIJzRIAA4rHz4UR2D17nZ5fGFA",r:4.8,n:2890,price:"人均 200–300 比索（Google）",note:"早餐 / brunch 店，有安静的户外庭院。Google 上网友推荐配北方炸猪皮的玉米片（chilaquiles con chicharrón norteño）。"},
   {h:"市场"},
   "有网友逛了乔卢拉的菜市场：门口炸的馅饼有土豆、芝士和猪脑馅，熟羊排约 60 比索，菠萝辣椒冰棒约 22 比索，还有各种烤肉、炖肉 taco。网友没写市场名字，镇中心的市场是 [[pid:ChIJRUY-77HHz4URUkrkga-zhAw|Mercado municipal Cosme del Razo Cholula|Mercado Cosme del Razo]]（Google 4.6 ★（27 条）），建议出发前核实。",
   {src:"来源：小红书笔记「墨西哥圣诞游 - Puebla和Cholula」（@屏蔽亲友团qaq）、「墨西哥城/Puebla美食记录」（@mq）、「墨西哥🇲🇽D12cholula雨中citywalk」（@大家好我是索拉李丝丝）、「墨西哥puebla三日游行程之cholula小镇」（@小雪儿）、「🇲🇽Puebla普埃布拉地道本地人科普攻略」（@糯米味Diana）、「Day 14 墨西哥普埃布拉Puebla」（@喵星人🐱）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
  hotel:["乔卢拉（Cholula）不推荐住宿：看完日落，走「1 天来回」的话直接回墨城；走「2 天」的话去普埃布拉（Puebla）住，酒店看普埃布拉页面的「酒店推荐」。",
   "从乔卢拉去普埃布拉：网友打 Uber 约 166 比索（12 公里）；也有网友坐蓝色小巴，单程 8–10 比索，在普埃布拉市中心 10 街和 7 街一带上车。",
   {src:"来源：小红书笔记「Day 14 墨西哥普埃布拉Puebla」（@喵星人🐱）、「墨西哥🇲🇽D12cholula雨中citywalk」（@大家好我是索拉李丝丝）。"}]}
};
GUIDE.coldlake={
 transport:[{h:"建议游玩路线：墨城 → 冷水湖 → 墨城"},
  "map:estacas",
  "leg:i",
  "[[link:https://www.google.com/maps/dir/Ciudad+de+M%C3%A9xico/Las+Estacas+Parque+Natural/Ciudad+de+M%C3%A9xico|在 Google 地图打开这条路线导航]]",
  "大巴站：墨城南站 [[map:Terminal Central del Sur Taxqueña|Terminal Central del Sur（Tasqueña）]]；到达 [[map:Terminal de autobuses Yautepec Morelos|Yautepec 长途车站]]，再打车去园区。",
  {h:"注意"},
  "租车要注意：有网友在租车平台订了早上 7:30 取车，结果市区车行 9 点才开门、下午 3 点关门、周日不开，只能去机场还车。订车前问清楚营业时间。",
  "园区门口不好打车，没开车的话提前和司机约好回程，或者请工作人员叫出租车。",
  {src:"来源：小红书笔记「Las Estacas 出行攻略」（@Dino）、「🇲🇽墨城周边-Las Estacas冷水湖公园」（@kukuclouds）、「墨西哥冷水湖｜一日往返玩水绝佳去处💦」（@taniashan）、「墨西哥冷水湖—坎昆平替」（@散仙儿）、「墨城自驾一日游TOP1目的地-冷水湖攻略」（@Leon不是Leo）、「Las Estacas 冷水湖露营 的一些细节。」（@Molee）；自驾时间和距离来自 Google 地图（2026 年 10 月）。"}],
 route:[{h:"玩什么（网友推荐）"},
  "[[pid:ChIJeWOnMrV-zoURY1qzrHl9gJ0|Las Estacas Parque Natural|冷水湖公园（Las Estacas Parque Natural）]]：Google 4.7 ★（15,781 条）。泉水形成的天然小河，网友说水温常年约 23 °C，清澈见底，能看到水下的鱼和水草。网友说园区不算大，主要是玩水、游泳和放松，玩一整天正好。",
  "门票：[[link:https://www.lasestacas.com|官网]]显示一日票（Daypass）585 比索，带露营的一日票（Daycamp）860 比索，8 点入园、18 点离园（2026 年 10 月查询）。官网说价格按日期浮动，网上买的票只能在选定的那天用。出园后门票就失效。",
  "玩水：从源头顺流漂、跳台跳水、秋千跳水、索道跳水、浮潜、桨板、皮划艇、租船（网友付过 375 比索，押金 300）。水流急、踩不到底，不会游泳的一定要穿救生衣或带泳圈，网友建议自带泳圈，园区租的很大（约 200 比索，押金 200）。",
  "休息：Jardín Hamacas 吊床区人少安静；园区有活动日程表（观察动植物、瑜伽、spa 等），在租借处旁的柜台预约。",
  "要带的：泳衣、泳镜、毛巾、拖鞋、防晒、驱蚊液、野餐垫、防水手机袋、换洗衣服，以及足够的现金（租东西的押金只收现金，网友建议至少带 1,000 比索）。不能带玻璃瓶和泡沫容器，不能带宠物、不能飞无人机。",
  {h:"1–2 天行程"},"route:estacas",
  {src:"来源：小红书笔记「🇲🇽墨城周边-Las Estacas冷水湖公园」（@kukuclouds）、「Las Estacas 出行攻略」（@Dino）、「墨西哥冷水湖｜一日往返玩水绝佳去处💦」（@taniashan）、「墨西哥冷水湖—坎昆平替」（@散仙儿）、「Las Estacas 冷水湖露营 的一些细节。」（@Molee）、「墨城自驾一日游TOP1目的地-冷水湖攻略」（@Leon不是Leo）、「墨西哥值得去的地方——Las Estacas冷水湖」（@乖乖在埃及开罗）、「Las Estacas一日游」（@和旸💕💕💕💕）、「消暑胜地冷水湖Las Estacas」（@高价回收二手航母火箭宇宙飞船）；门票来自 Las Estacas 官网，评分来自 Google 地图（2026 年 10 月）。"}],
 food:["冷水湖在园区里吃饭，周边没有网友推荐的餐厅。网友提醒：吃的喝的最好一次带进去，出园后门票就失效。",
  {h:"园区餐厅"},
  "园区里有好几个餐厅和商店。网友推荐餐厅的夏威夷汉堡，约 160 比索含薯条；另一家是自助餐，网友说人均 100 多元人民币，也有住园区的网友吃了晚餐自助和第二天的早餐。还有像市场一样的小吃档口，以及能买零食、饮料、泳衣、拖鞋的小超市。记得带现金。",
  {h:"自带野餐、烧烤"},
  "可以自带食材在烧烤区烤，网友的说法不一：有人说烤炉免费、炭要买（约 100 比索），也有人说烤架加炭要租、押金约 600 比索。也可以请工作人员帮你烤：网友说整天（约 11:00–17:00）每人约 1,000 比索，半天约 500 比索，小费另给。",
  {src:"来源：小红书笔记「🇲🇽墨城周边-Las Estacas冷水湖公园」（@kukuclouds）、「墨西哥值得去的地方——Las Estacas冷水湖」（@乖乖在埃及开罗）、「Las Estacas 冷水湖露营 的一些细节。」（@Molee）、「墨西哥冷水湖｜一日往返玩水绝佳去处💦」（@taniashan）、「墨城自驾一日游TOP1目的地-冷水湖攻略」（@Leon不是Leo）、苏酥酥饼的笔记（无标题）。"}],
 hotel:["走「2 天 1 晚」路线时住园区里。网友说住宿相对比较贵，也有网友觉得住帐篷晚上冷、不推荐，建议当天回墨城。想住的话，官网（lasestacas.com）有酒店（标准间和套房）、Glamping 和露营，都要提前订；官网没有写房价。","Google 地图没有给出固定房价，下面按住宿类型分成三档，实际房价以官网和预订网站为准。",
  {h:"冷水湖 · 高端"},
  {name:"Las Estacas 园区酒店",q:"Las Estacas Parque Natural",pid:"ChIJeWOnMrV-zoURY1qzrHl9gJ0",r:4.7,n:15781,note:"Google 把整个园区标为四星酒店（评分是整个园区的）。有套房和双人间；官网没有写房价，网友说约 2,000 比索一晚。"},
  {h:"冷水湖 · 中档精品"},
  {name:"Las Estacas Glamping",q:"Las Estacas Parque Natural",pid:"ChIJeWOnMrV-zoURY1qzrHl9gJ0",note:"官网写的是河边私人空间里的帐篷。有网友提醒园区住宿要提前订，订不到只能住普通帐篷。"},
  {h:"冷水湖 · 经济"},
  {name:"Las Estacas 露营",q:"Las Estacas Parque Natural",pid:"ChIJeWOnMrV-zoURY1qzrHl9gJ0",note:"可以自带帐篷，也可以租园区的帐篷。官网的露营一日票（Daycamp）是 860 比索（2026 年 10 月查询）。门口工作人员给 100 比索小费帮你把装备运进去，再给 100 帮你搭帐篷；有淋浴间，自带毛巾和洗浴用品。晚上容易下雨、比较冷，做好防水和保暖。"},
  {name:"Villas El Paraíso, El Rollo",q:"Villas El Paraíso El Rollo",pid:"ChIJAdOA8wh_zoURPfYQwfufhz8",r:4.4,n:249,note:"园区外的选择，Google 标为三星，在 Tlaquiltenango，离 El Rollo 水上乐园约 5 分钟车程，需要开车去冷水湖。Google 上网友说安静干净、有泳池和停车场，价格实惠；浴室小、插座少。"},
  {src:"来源：小红书笔记「Las Estacas 出行攻略」（@Dino）、「las estacas 冷水湖 超级出片」（@Silvia_）、「Las Estacas 冷水湖露营 的一些细节。」（@Molee）、「墨城自驾一日游TOP1目的地-冷水湖攻略」（@Leon不是Leo）、苏酥酥饼的笔记（无标题）；住宿类型和露营票价来自 Las Estacas 官网（2026 年 10 月）；Villas El Paraíso 参考 Google 地图评论。评分来自 Google 地图（2026 年 10 月）。"}]};
GUIDE.antro={
 transport:[{h:"建议游玩路线：酒店 → 国家人类学博物馆 → Polanco → 酒店"},
  "leg:j",
  {src:"来源：[[link:https://mna.inah.gob.mx/|博物馆官网]]（停车和交通，2026 年 10 月查询）；小红书笔记「🇲🇽墨西哥城人类学博物馆，我双手双脚推荐」（@简格格J.的朋友圈🌍）；自驾和公交时间来自 Google 地图（2026 年 10 月）。"}],
 route:[{h:"玩什么（网友推荐）"},
  "[[pid:ChIJScjIILQB0oURJMVub-MaI4Q|Museo Nacional de Antropología|国家人类学博物馆（Museo Nacional de Antropología）]]：Google 4.8 ★（92,751 条）。",
  "[[link:https://mna.inah.gob.mx/|官网]]：周二至周日 9:00–18:00，周一闭馆；门票 210 比索，墨西哥人和在墨居民 105 比索；周日墨西哥人和持有效居留证件的外国居民免费；13 岁以下、持证师生、60 岁以上墨西哥人免费。可以在 INAH 网站提前买票。只能带小包进馆，寄存免费（9:00–17:00）；不能带宠物和食物，带相机、摄像机拍摄要另交费（2026 年 10 月查询）。",
  "怎么逛：网友建议主攻一楼的古文明展厅，二楼是现代原住民生活，时间紧可以挑着看。留 3–4 小时比较从容，只看一楼 1.5–2 小时也行。",
  "必看：墨西加厅（Sala Mexica）的太阳石（Piedra del Sol）、奥尔梅克巨石头像、玛雅帕卡尔王（Pakal）棺盖浮雕和玉石面具、特奥蒂瓦坎羽蛇神神庙模型，以及中庭的混凝土「大伞」。",
  "看不懂西语：网友说不请讲解很多看不懂，有人报了中文讲解小团；也有网友用手机 AI 视频解说，馆内有免费 Wi-Fi（时不时要重新登录）。纪念品店可以用自己的生日做一个玛雅历法纪念品。",
  {h:"半天或一天"},"route:antro",
  {src:"来源：[[link:https://mna.inah.gob.mx/|博物馆官网]]（开放时间、门票、参观须知，2026 年 10 月查询）；小红书笔记「人类学博物馆｜历史文盲也被震撼的一天🪨」（@taniashan）、「🇲🇽墨西哥城人类学博物馆，我双手双脚推荐」（@简格格J.的朋友圈🌍）、「🇲🇽人类学博物馆｜报名讲解版」（@陈果果_）、「墨城千万别踩周日的雷！国立人类学博物馆」（@WangFang）、「墨西哥｜1.5小时，速通人类学博物馆」（@Woody+）、「逛完才发现，我对墨西哥了解得太少」（@Leon 侯乐康）、「人类学博物馆🦍」（@兔本兔）、「别着急走！人类学门口尝尝森系松鼠咖啡厅」（@墨西哥陈导）；评分来自 Google 地图（2026 年 10 月）。"}],
 food:["博物馆里不能带食物，馆内只有一家餐厅。博物馆就在 Polanco 旁边，看完可以去 Polanco 吃。",
  {h:"博物馆里"},
  {name:"Sala Gastronómica",q:"Sala Gastronómica Museo Nacional de Antropología",pid:"ChIJGQK9g0n_0YURdh1Z2H2T-7o",r:4.2,n:1875,price:"人均 200–700 比索（Google）",note:"博物馆一楼唯一的餐厅，官网写周二至周日 9:00–18:00。Google 上网友说菜单按墨西哥各地区的传统菜分类，环境好。"},
  {h:"Polanco"},
  {name:"La Bonvi - Polanco",q:"La Bonvi Polanco",pid:"ChIJf6ehEgAD0oURdViO6BHjrTo",r:4.9,n:8140,price:"人均 300–800 比索（Google）",note:"taco 店，在 Anatole France 街。网友说进门送生啤，绿植多、中庭有阳光；taco 饼现做，推荐生金枪鱼、牛裙排（skirt steak）、蒜香虾和鱼 taco。Google 上网友说门口常排队。"},
  {name:"El Remolkito del Sirloin Polanco",q:"El Remolkito del Sirloin Polanco",pid:"ChIJp5A8ewAB0oURAmObK0VjNyE",r:4.9,n:765,price:"人均 300–600 比索（Google）",note:"专做西冷牛排 taco。网友连吃两天，最推荐 Gaonela Remolkito 和 Gaonela Sirloin（前者多了牛油果和烤洋葱）。"},
  {name:"Mariscocho Polanco",q:"Mariscocho Polanco",pid:"ChIJjZsFYjcD0oURKNl0EJxN8jI",r:4.7,n:1406,price:"人均 400–1,000 比索（Google）",note:"海鲜店，黄色桌子很亮眼。网友推荐海鲜塔、奶油炸虾和虾 taco；有网友说章鱼偏咸但很嫩，人均约 500 比索。"},
  {name:"Carmela y Sal",q:"Carmela y Sal Polanco",pid:"ChIJl4fTGPcB0oURyKXHN0pAcQ4",r:4.5,n:3061,note:"创意墨西哥菜。网友推荐圣诞季的烤乳猪，觉得招牌牛小排一般；服务好。"},
  {name:"Sylvestre",q:"Sylvestre Polanco",pid:"ChIJmRVReQIC0oURpEP2rezbOa8",r:4.5,n:1310,price:"人均 1,000 比索以上（Google）",note:"高端餐厅，在 1953 年的老宅 Casa Calderón 里，有整面书墙和绿色庭院。网友推荐生牛肉片、海鲜拼盘和炭烤牛肉。"},
  {src:"来源：[[link:https://mna.inah.gob.mx/|博物馆官网]]（餐厅时间）；小红书笔记「CDMX 🇲🇽 | 墨西哥城Polanco吃了点啥」（@大章鱼宝宝）、「墨城🇲🇽｜Polanco最有老钱风的餐厅」（@王可可）、「墨西哥城Polanco区高分taco店 La Bonvi」（@Raaaaaaach）、「墨城海鲜探店 MARISCOCHO」（@举个栗子🌰）、「墨西哥城🇲🇽4.9分西冷牛排taco🌮️连吃2天」（@一块酥酥饼）；Sala Gastronómica 参考 Google 地图评论。评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
 hotel:["人类学博物馆在墨城市区，从 Polanco 一带的酒店过去十几分钟，当天来回就行，不用另外订酒店。","朋友来墨城玩的话，建议住 Polanco 或罗马区（Roma），比较安全，去博物馆也方便。"]};
const CDMX_STAY=["墨城市区一日游，住在墨城的酒店当天就能来回，不用另外订酒店。","朋友来墨城玩的话，建议住 Polanco 或罗马区（Roma），比较安全，去各个景点也方便。"];
GUIDE.antro.hotel=CDMX_STAY;
GUIDE.teo={
 transport:[{h:"建议游玩路线：墨城 → 特奥蒂瓦坎 → 墨城"},
  "map:teo",
  "leg:k",
  "[[link:https://www.google.com/maps/dir/Ciudad+de+M%C3%A9xico/Zona+Arqueol%C3%B3gica+de+Teotihuac%C3%A1n/Ciudad+de+M%C3%A9xico|在 Google 地图打开这条路线导航]]",
  "大巴站：墨城北站 [[map:Terminal Central de Autobuses del Norte|Terminal Central del Norte]]。",
  {h:"注意"},
  "景区里没有厕所，网友说厕所只在各个入口；1 号门和 3 号门有卖水的小店。整个景区手机信号时断时续。",
  {src:"来源：小红书笔记「特奥蒂瓦坎 公交门票路线详细攻略」（@A—₩an爷）、「🇲🇽 特奥蒂瓦坎半日游 超详细攻略」（@Elfsong）、「墨西哥城｜特奥蒂瓦坎金字塔不报团攻略」（@EmptyCup）、「墨西哥金字塔自由行｜392比索搞定车票＋门票」（@Zane的旅游日记）、「⚠️最新特奥蒂瓦坎，日月金字塔」（@梦）、「特奥蒂瓦坎懒人不早起版」（@SputnikPistol）、「墨西哥特奥蒂瓦坎金字塔一些小tips」（@瓜瓜是只伯恩山）；自驾时间和距离来自 Google 地图（2026 年 10 月）。"}],
 route:[{h:"玩什么（网友推荐）"},
  "[[pid:ChIJ-Q-zXoTq0YUROAxtvosnhK0|Pyramid of the Sun Teotihuacan|特奥蒂瓦坎遗址（Teotihuacán）]]：Google 4.8 ★（27,648 条）。",
  "[[link:https://lugares.inah.gob.mx/en/fut-cultura/6731|INAH 官网]]：每天 8:00–17:00 开放（2026 年 10 月查询）。官网这一页没写门票；INAH 的乔卢拉官网页把同一档遗址写成外国游客 210 比索、墨西哥人 105 比索，墨西哥新闻报道特奥蒂瓦坎 2026 年也是这个价，出发前核实。网友说门票只收现金。",
  "路线：网友推荐 3 号门进，月亮金字塔 → 亡灵大道 → 太阳金字塔 → 博物馆 → 羽蛇神庙，从 1 号门往 2 号门出，不走回头路。全程约 3 公里土路，留 4 小时左右。",
  "拍照：月亮金字塔台阶上去左右各有一块平石头，网友说左边人少；快到 2 号门时从亡灵大道上拍太阳金字塔。",
  "要带的：现金、水、帽子、防晒，网友强调「巨晒」，有人建议带伞。纪念品摊很多，同样的东西价格差很大，可以砍价；网友买黑曜石小猫付了 150 比索。不能飞无人机。",
  {h:"半天或一天"},"route:teo",
  {src:"来源：INAH 官网（开放时间，2026 年 10 月查询）；门票参考 INAH 乔卢拉官网页和 [[link:https://www.adn40.mx/mexico/2026-01-06/prepara-camara-precio-oficial-teotihuacan-chichen-itza-todos-museos-inah-2026/|adn40 报道]]；小红书笔记「特奥蒂瓦坎 公交门票路线详细攻略」（@A—₩an爷）、「日月金字塔+洞穴餐厅+贫民窟缆车🚡最佳路线」（@跟着巨巨走世界）、「🇲🇽 特奥蒂瓦坎半日游 超详细攻略」（@Elfsong）、「墨西哥城｜特奥蒂瓦坎金字塔不报团攻略」（@EmptyCup）、「特奥蒂瓦坎懒人不早起版」（@SputnikPistol）、「墨西哥城🇲🇽本地帅哥带我吃喝攻略」（@Clive）、「墨西哥特奥蒂瓦坎金字塔一些小tips」（@瓜瓜是只伯恩山）；评分来自 Google 地图（2026 年 10 月）。"}],
 food:["景区里没有餐厅，只有入口附近的小店和羽蛇神庙对面的咖啡店（网友说可以进去吹空调）。网友建议自带水和吃的。",
  {name:"La Gruta",q:"La Gruta Teotihuacan",pid:"ChIJUe8vcIHq0YUR3bTiJN-8cn8",r:4.3,n:18983,note:"建在山洞里的网红餐厅，从太阳金字塔后面的 5 号门出去走五六分钟。网友评价不一：有人觉得性价比低、可去可不去；餐厅里完全没信号，最好提前看好菜单；蚂蚁卵（escamoles）可以尝个新鲜但偏贵；不推荐 400 多比索一杯的 Horchata 鸡尾酒。"},
  "回程坐大巴在 Indios Verdes 下车的话，网友说地铁站旁边的 taco 摊 30 比索 5 个，很好吃。",
  {src:"来源：小红书笔记「墨西哥特奥蒂瓦坎金字塔一些小tips」（@瓜瓜是只伯恩山）、「日月金字塔+洞穴餐厅+贫民窟缆车🚡最佳路线」（@跟着巨巨走世界）、「特奥蒂瓦坎懒人不早起版」（@SputnikPistol）、「🇲🇽 特奥蒂瓦坎半日游 超详细攻略」（@Elfsong）；评分来自 Google 地图（2026 年 10 月）。"}],
 hotel:["特奥蒂瓦坎从墨城当天就能来回，一般不用住。想一早坐热气球、或 8 点开门就进场的话，可以住遗址附近。","Google 地图没有给出固定房价，实际房价以预订网站为准。小红书上没找到推荐的酒店，下面参考 Google 地图评论。",
  {h:"特奥蒂瓦坎 · 中档精品"},
  {name:"Villas Arqueológicas Teotihuacán",q:"Villas Arqueologicas Teotihuacan",pid:"ChIJHxwko2Pq0YURmW2iZGlhgZw",r:4.4,n:1675,note:"Google 标为四星，就在考古区旁边，位置最近。但最近几个月 Google 上有几条差评：有人说房间里东西被偷、窗户锁不上、房价不含早餐。"},
  {h:"特奥蒂瓦坎 · 经济"},
  {name:"Hotel Central Pirámides",q:"Hotel Central Pirámides San Martín de las Pirámides",pid:"ChIJ-cQ_bNPB0YURj7uHOQo0cw8",r:4.9,n:115,note:"Google 标为三星，在 San Martín de las Pirámides 镇上。Google 上网友说就在汽车站旁边，离遗址 3 号、4 号门不远；房间新、干净，老板热情，隔壁餐厅的早餐便宜好吃。"},
  {src:"来源：Google 地图评论；评分来自 Google 地图（2026 年 10 月）。"}]};
GUIDE.zocalo={
 transport:[{h:"建议游玩路线：酒店 → 宪法广场和老城 → 酒店"},
  "leg:l",
  {h:"注意"},
  "广场人多，看好随身物品。国家宫要带护照原件。网友提醒，有公共活动时（比如亡灵节前后）老城几处标志性建筑会临时围起来。",
  {src:"来源：小红书笔记「墨西哥城历史中心city walk一日游经典路线」（@跟着巨巨走世界）、「墨城旅拍｜这几个标志性点位临时围挡」（@小张老师的摄影日记（墨西哥版））；自驾和公交时间来自 Google 地图（2026 年 10 月）。"}],
 route:[{h:"玩什么（网友推荐）"},
  "[[map:Zócalo Ciudad de México|宪法广场（Zócalo）]]：免费，四周是大教堂、国家宫和大神庙遗址，网友说能看到升降旗和雄鹰叼蛇雕塑。",
  "[[map:Palacio Nacional Ciudad de México|国家宫（Palacio Nacional）]]：网友说免费，但只能当天到对面 Museo de la SHCP 排队登记、跟导游分批进，带护照原件，周一不开放。有网友第一天中午去已经没号，第二天一早才排上。",
  "[[pid:ChIJ4a8nxjL50YURJ19RJ_A9T5E|Catedral Metropolitana Ciudad de México|大教堂（Catedral Metropolitana）]]：Google 4.7 ★（24,352 条）。网友说免费，看点有宽恕祭坛（Altar del Perdón）、国王祭坛（Altar de los Reyes）和两侧的礼拜堂。官网没有查到开放时间。",
  "[[map:Templo Mayor Ciudad de México|大神庙遗址（Templo Mayor）]]：[[link:https://www.templomayor.inah.gob.mx|官网]]显示博物馆周二至周日 9:00–17:00 开放，官网没写门票（2026 年 10 月查询）。网友说最值得看的是神庙一层压一层的七次扩建，以及室内的月亮女神（Coyolxauhqui）石雕。",
  "老城步行线：马德罗步行街、瓷砖之家、邮政宫、艺术宫都在步行范围内。网友说想听懂历史可以报中文讲解的 citywalk。",
  {h:"半天或一天"},"route:zocalo",
  {src:"来源：大神庙博物馆官网（开放时间，2026 年 10 月查询）；小红书笔记「🇲🇽如何预约进入墨西哥国家宫参观」（@是老张nei）、「花了两天时间才参观到墨西哥总统府/国家宫」（@坐着🚢环游世界）、「参观国家宫的注意事项」（@海桐）、「墨西哥城历史中心city walk一日游经典路线」（@跟着巨巨走世界）、「墨西哥城🇲🇽本地帅哥带我吃喝攻略」（@Clive）、「墨西哥，一座藏在地下500年的阿兹特克都城」（@Ivy逃跑的蜗牛）、「解决墨城游览最痛点/九公里世遗怎么玩？」（@墨西哥陈导）；评分来自 Google 地图（2026 年 10 月）。"}],
 food:["老城里吃饭的地方很多。网友的经验：人气旺的小店可以放心进，只收现金的店往往更地道；本地人吃的 taco 一个约 30 比索，路边摊约 18 比索，网红店 70–120 比索。",
  {name:"El Cardenal Alameda",q:"El Cardenal Alameda",pid:"ChIJtfhD_tT40YURj39iqrcd2ww",r:4.7,n:13429,price:"人均 200–600 比索（Google）",note:"网友把这里当老城步行线的早餐第一站。Google 上网友说开门后很快就满座，最好开门一小时内到。"},
  {name:"Sanborns（瓷砖之家 Casa de los Azulejos）",q:"Sanborns Casa de los Azulejos",pid:"ChIJG7t3hCv50YURi4Zcxtflo7k",r:4.2,n:5129,note:"开在瓷砖之家老宅里的连锁餐厅（1919 年起由 Sanborns 经营）。网友说主要是为了拍照进去吃，味道不算惊艳、汤有点咸，饮品不错；二楼有柳树图案瓷器的展板。"},
  "广场边有几家能上二楼露台的餐厅，网友说坐在露台上能看到广场和大教堂，适合慢慢吃午饭。",
  {src:"来源：小红书笔记「墨西哥城历史中心city walk一日游经典路线」（@跟着巨巨走世界）、「墨西哥城历史文化中心餐厅推荐」（@自然卷之旅）、「🇲🇽墨西哥①｜在墨西哥城的心脏吃午餐」（@盖子）、「终于搞懂了一点怎么在墨西哥城点菜了」（@漾漾轻舟）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
 hotel:CDMX_STAY};
GUIDE.frida={
 transport:[{h:"建议游玩路线：酒店 → 蓝房子 → 科约阿坎 → 酒店"},
  "leg:m",
  {src:"来源：[[link:https://boletos.museofridakahlo.org.mx/es/tickets/museo-frida-kahlo-cdmx|蓝房子官方购票页]]（停车，2026 年 10 月查询）；自驾和公交时间来自 Google 地图（2026 年 10 月）。"}],
 route:[{h:"玩什么（网友推荐）"},
  "[[pid:ChIJOz-6AMT_0YURofTM9_ekAWI|Museo Frida Kahlo|蓝房子（Casa Azul · Museo Frida Kahlo）]]：Google 4.5 ★（45,566 条）。",
  "[[link:https://www.museofridakahlo.org.mx|官网]]：周一闭馆；周二、周四至周日 10:00–18:00，周三 11:00–18:00；每周四有夜场「Noche Azul」17:15–21:00；参观约 1 小时；6 岁以下免费；门票包含用手机（不开闪光灯）拍照；没有停车场。官方购票页要选日期和时段，页面上没直接写票价，网友说正常票 320 比索、学生票 60 比索（官网信息为 2026 年 10 月查询）。",
  "网友提醒：一定要提前在官网买票，热门时段很难抢；迟到 15 分钟会取消预约；游客很多，拍照要排队。门票还能进 Anahuacalli 博物馆。",
  "科约阿坎（Coyoacán）：蓝房子旁边的老街区，有市场、手工艺品市集、百年油条店和老咖啡馆，适合下午慢慢逛。周六还可以去 San Ángel 的 [[map:Bazar Sábado San Ángel|周六市集（Bazar Sábado）]]。",
  {h:"半天或一天"},"route:frida",
  {src:"来源：蓝房子官网和官方购票页（开放时间、参观须知，2026 年 10 月查询）；小红书笔记「墨西哥最严最难预约的博物馆-蓝房子」（@beryl）、「去墨城🇲🇽Frida蓝房子前&后，你可以」（@小曦在孕晚期）、「🇲🇽CDMX｜如果你也没抢到弗里达蓝屋的门票…」（@山雀）、「墨西哥城Coyoacán一日游攻略」（@.Silver linings呆鸭🌟）、「museo frida kahlo一日完美安排总结」（@呼伦贝尔弹钢琴）、「墨城Day4｜奔赴弗里达蓝房子💙附预约攻略」（@拔丝地图蘸海吃）；评分来自 Google 地图（2026 年 10 月）。"}],
 food:["蓝房子周边就是科约阿坎老街区，吃饭主要在市场和老店。",
  {name:"科约阿坎市场（Mercado de Coyoacán）",q:"Mercado de Coyoacán",pid:"ChIJeYLOZMT_0YURFEhp2ubb43c",r:4.5,n:56335,note:"离蓝房子走几分钟。网友说市场里最有人气的 taco 摊闭眼点都不踩雷，一定要试黑玉米菌（huitlacoche）；还推荐买瓦哈卡辫子奶酪（quesillo）和 piñata，价格比超市合适，可以砍价。也有便宜的鲜榨果汁。"},
  {name:"Café El Jarocho",q:"Cafe El Jarocho Coyoacán",pid:"ChIJWxNQnsT_0YURxs-c3oS8w8o",r:4.5,n:18048,price:"人均 100 比索以内（Google）",note:"科约阿坎有名的老咖啡馆，网友说本地人也推荐。"},
  "[[map:Churrería El Moro Coyoacán|Churrería El Moro（科约阿坎店）]]：百年油条（churros）店，网友说刚出锅很脆，但糖霜多、夹冰淇淋的吃一根就腻，建议单点一两根配巧克力酱。",
  {src:"来源：小红书笔记「museo frida kahlo一日完美安排总结」（@呼伦贝尔弹钢琴）、「去墨城🇲🇽Frida蓝房子前&后，你可以」（@小曦在孕晚期）、「墨西哥城Coyoacán一日游攻略」（@.Silver linings呆鸭🌟）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
 hotel:CDMX_STAY};
GUIDE.vasco={
 transport:[{h:"建议游玩路线：酒店 → 瓦斯孔塞洛斯图书馆 → 酒店"},
  "leg:n",
  {h:"注意"},
  "注意导航别选错：墨城还有一座 Biblioteca de México「José Vasconcelos」，在 Ciudadela，不是这座悬浮书架的图书馆。要找的是 Buenavista 站旁边那座。",
  {src:"来源：[[link:https://mexicocity.cdmx.gob.mx/venues/vasconcelos-library/|墨城旅游局网站]]（地址和地铁站）；小红书笔记「#打卡墨西哥到梦空间图书馆」（@把思念转化成分享）；自驾和公交时间来自 Google 地图（2026 年 10 月）。"}],
 route:[{h:"玩什么（网友推荐）"},
  "[[pid:ChIJ6d9af9n40YURPUNrUN4aOKs|Biblioteca Vasconcelos|瓦斯孔塞洛斯图书馆（Biblioteca Vasconcelos）]]：Google 4.7 ★（8,821 条）。",
  "开放时间和门票：墨城旅游局网站没写，图书馆官网（bibliotecavasconcelos.gob.mx）2026 年 10 月打不开。网友说免费、不用预约，每天 8:30–19:30 开放，出发前核实。",
  "拍照：一楼大厅正中仰拍鲸鱼骨架和悬浮书架，再坐电梯到高层俯拍中庭。网友说手机随便拍；带相机等专业设备要在前台用护照登记。",
  "这里是真正在用的公共图书馆，保持安静、别影响读者。网友说留 1–3 小时都可以。",
  {h:"半天行程"},"route:vasco",
  {src:"来源：墨城旅游局网站（地址和交通）；小红书笔记「天啊这图书馆居然是真的😱」（@石头Walkman🚶）、「📍Mexico🇲🇽丨Biblioteca Vasconcelos」（@Peace🏅）、「🇲🇽墨西哥｜一座藏在图书馆里的“折叠城市”」（@鹿男又要出发啦）、「#打卡墨西哥到梦空间图书馆」（@把思念转化成分享）、「墨西哥城必打卡📖盗梦空间般悬浮图书馆」（@山下风）；评分来自 Google 地图（2026 年 10 月）。"}],
 food:["图书馆周边没有网友推荐的餐厅。网友说附近几百米有 [[map:Fórum Buenavista|Fórum Buenavista 商场]]，可以在商场里吃饭休息。",
  {src:"来源：小红书笔记「#打卡墨西哥到梦空间图书馆」（@把思念转化成分享）。"}],
 hotel:CDMX_STAY};
/* 海岛游：10 个地点是一条路线，共用「路线和交通」「行程安排」；餐厅和住宿按地点分开。 */
const YUC_TRANSPORT=[{h:"建议游玩路线：墨城 ✈ 坎昆 → 普拉亚德尔卡门 → 图卢姆 → 巴卡拉尔 → 切图马尔 ✈ 墨城"},
  "map:yuc",
  "leg:fl",
  {h:"注意"},
  "租车：网友建议租 SUV，图卢姆一带土路多、很颠；租车常被要求加买保险，提前看清楚条款。很多路段没有信号，一定要下载离线地图。",
  "打车：图卢姆机场和镇上基本叫不到 Uber、DiDi，网友多靠租车、colectivo 小巴或出租车。",
  "季节：网友说 8–10 月雨多风大，可能遇到飓风，浮潜和出海常被取消；有些季节海滩会被海藻占满。",
  {src:"来源：小红书笔记「坎昆图卢姆PDC交通大法」（@YIYI的DIY旅行）、「🚗墨西哥Tulum自驾贴士」（@青原de世界观察日记🚂）、「大数据推给正在做Tulum攻略的人！别盲目跟风」（@avec_clara）、「Cancun 的一些小Tips」（@shirleyQ）、「CANCUN 坎昆交通-ADO 大红巴士🚌和打的🚖」（@加州小飞猪）、「带三岁男娃勇闯坎昆-交通避雷」（@面面条条）、「墨城出发Bacalar 3天2晚攻略」（@糖月月）；自驾时间和距离来自 Google 地图（2026 年 10–11 月）。"}];
/* 海岛游各景点「玩什么」，坎昆路线、图卢姆和普拉亚的 5 天路线、各地点页面共用 */
const YUC_W={
  cancun:"坎昆：[[pid:ChIJTc0cUYCCTo8R5IF6JQxSq-Q|Playa Delfines Cancún|海豚海滩（Playa Delfines）]] Google 4.8 ★（30,069 条）。网友说「7」字形的酒店区海滩比南边好；买纪念品可以去[[pid:ChIJh15X1rLYzYURzLAWv5IOZAA|Mercado 28 Cancún|28 号市场（Mercado 28）]]（Google 4.3 ★（60,131 条））。",
  mujeres:"女人岛：[[pid:ChIJRTrNNgMwTI8R_uGrRh86_GY|Playa Norte Isla Mujeres|北海滩（Playa Norte）]] Google 4.8 ★（24,429 条），下船走 10 分钟，沙子细软；最南端[[pid:ChIJQVVbfaglTI8RCdudYGGQbYk|Punta Sur Isla Mujeres|南端断崖（Punta Sur）]] Google 4.8 ★（13,954 条），悬崖看海、有雕塑公园，网友说要门票（有人说 8 美元，有人说 150 比索）。岛上网友租高尔夫球车约 500 比索一小时、1,500 比索一天（要带驾照），或者打车，码头到最南端约 150 比索，先谈价。",
  xpark:"X 系列乐园：[[pid:ChIJU3DYrW1ETo8RpQkYkh7oQoA|Xcaret Park|Xcaret]] Google 4.8 ★（118,653 条）、[[pid:ChIJ44qsfvVDTo8Rs89AYspFfVY|Xplor Park|Xplor]] Google 4.8 ★（31,430 条）、[[pid:ChIJwf__P8kyTo8RlnFHVjYm4w8|Parque Xel-Há|Xel-Há]] Google 4.8 ★（60,243 条）。官网各园区首页显示的常规票价：Xcaret 2,756.50 比索、Xel-Há 2,386.50 比索、Xplor 2,941.50 比索，提前 7 天买有优惠，具体包含什么以官网套餐为准；开放时间 Xel-Há 周二不开、8:30–18:00，Xplor 周一至周六 8:30–19:00（2026 年 10 月查询）。网友说 Xcaret 晚上 7:30 的墨西哥大秀一定要看；Xel-Há 浮潜的鱼比以前少，有人觉得不值。",
  cozumel:"科苏梅尔：浮潜去[[map:El Cielo Cozumel|El Cielo]]（水浅，满地海星，不能碰，会罚款），会游泳的可以去 Columbia、Palancar 礁。网友在码头报浮潜船付过 600 比索一人；不想下水可以坐[[pid:ChIJIVRicM1ZTo8RGJ31pNAPnr4|Atlantis Submarines Cozumel|Atlantis 潜水艇]]（Google 4.7 ★（1,938 条））；南边有[[pid:ChIJAflEe8msT48R8KN9L5HOFic|Punta Sur Eco Beach Park|Punta Sur 生态公园]]（Google 4.6 ★（2,870 条）），网友说门票约 24 美元。网友提醒别报太便宜的团，时间短、人多。",
  tulum:"图卢姆遗址：[[pid:ChIJZTIpFn3RT48RY8mSpPzWaP8|Tulum Archaeological Zone|图卢姆遗址（Zona Arqueológica de Tulum）]] Google 4.7 ★（71,980 条），少见的建在海边悬崖上的玛雅遗址。INAH 2024 年公告的开放时间是 8:00–17:00，官网页面没写门票；网友说要分别买国家公园和遗址两张票，塑料袋和塑料水瓶不能带进去。附近的艺术馆[[pid:ChIJ8ZPahpXVUY8RNhC8Ow6pp4E|SFER IK UH MAY|SFER IK Uh May]]（Google 4.7 ★（411 条））网友说很出片。",
  gran:"大天然井：[[pid:ChIJ_xjkInTUT48Rit_t2yqp8M4|Gran Cenote Tulum|大天然井（Gran Cenote）]] Google 4.3 ★（8,311 条），离图卢姆镇约 7 分钟车程，能和乌龟一起游。没有找到官网；网友说门票 500 比索、只收现金、只能进出一次，下水前必须淋浴、必须穿救生衣，潜水镜可以租（押证件）。也有网友觉得能游的范围小、偏贵。",
  dos:"双眼天然井：[[pid:ChIJ3bHaTUUtTo8R6FlVhvaTBzE|Cenote Dos Ojos|双眼天然井（Dos Ojos）]] Google 4.7 ★（7,922 条），和莲花池（Nicte-Ha）在同一个园区。没有找到官网；网友付过两个天然井的门票 700 比索一人，Dos Ojos 洞穴向导 tour 另加 500 比索，相机拍摄许可 300 比索，天然井之间坐园区的车 50 比索；下午 5 点关门。从图卢姆坐 colectivo 网友说约 40 比索。",
  chichen:"奇琴伊察：[[pid:ChIJ58CR48Y4UY8Rmk2ZaKGgHnw|Chichén Itzá|奇琴伊察（Chichén Itzá）]] Google 4.8 ★（138,214 条）。[[link:https://lugares.inah.gob.mx/en/node/5091|INAH 官网]]的遗址博物馆页写博物馆每天 8:00–17:00 开放、包含在遗址门票里（2026 年 10 月查询），官网没写遗址的票价和开放时间；网友 2026 年 5 月付过 697 比索，可以刷卡（更早的网友付过 671 比索，分两个窗口付现金），说 16 点停止入园。金字塔不能爬，不能飞无人机、不能带三脚架。晚上有灯光秀 Noches de Kukulkán，网友说人少不晒。",
  playa:"普拉亚德尔卡门：[[pid:ChIJO-CSZjlDTo8RVyEOZ9c6Ngs|Quinta Avenida Playa del Carmen|第五大道（Quinta Avenida）]]是一条和海平行的步行街，吃饭、购物、夜生活都在这条街上；网友推荐公共海滩（[[map:Playa del Carmen Public Beach|Playa del Carmen Public Beach]]），免费。",
  bacalar:"巴卡拉尔：[[pid:ChIJ1ZGLV5etW48R5whXdG-ckjM|Bacalar Lagoon|巴卡拉尔七色湖（Laguna de Bacalar）]] Google 4.8 ★（1,441 条）。漂流[[map:Los Rápidos de Bacalar|Los Rápidos de Bacalar]]（Google 4.1 ★（6,031 条）），网友付过 200 比索，储物柜另付；拍七色湖去[[pid:ChIJfcCPci-3W48R1iFEBvedXSw|Cenote Cocalitos Bacalar|Cocalitos]]（Google 4.6 ★（4,804 条）），网友付过 100 比索；玩水去[[pid:ChIJVahpdpCxW48RttP8HzLbwu8|Ecoparque Bacalar|Ecoparque Bacalar]]（Google 4.8 ★（904 条）），网友说约 20–40 比索。游湖可以报帆船或浮桥船，也能租皮划艇（网友付过 350 比索一天）。为了保护湖水，网友说不能涂防晒霜，要穿防晒衣；很多地方只收现金。"};
/* 「玩什么」的简短版：这些景点都有自己的页面，名字会自动链接过去，这里只写一句 */
const YUC_S={
  cancun:"坎昆（Cancún）：酒店区海滩看海，市区逛 28 号市场。",
  mujeres:"女人岛（Isla Mujeres）：从坎昆坐船约 30 分钟，北海滩水浅，最南端断崖看海。",
  xpark:"X 系列乐园（Xcaret · Xel-Há · Xplor）：地下河、浮潜、滑索，晚上有墨西哥大秀，一天玩一个园区。",
  playa:"普拉亚德尔卡门（Playa del Carmen）：第五大道吃饭逛街，公共海滩免费。",
  cozumel:"科苏梅尔岛（Cozumel）：从普拉亚坐船约 45 分钟，浮潜看海星和珊瑚。",
  tulum:"图卢姆（Tulum）：建在海边悬崖上的玛雅遗址，早上开门就去，人少不晒。",
  gran:"大天然井（Gran Cenote）：离图卢姆镇 7 分钟，能和海龟一起游。",
  dos:"双眼天然井（Dos Ojos）：洞穴天然井，跟向导浮潜看钟乳石。",
  chichen:"奇琴伊察（Chichén Itzá）：尤卡坦最有名的玛雅古城，世界新七大奇迹之一，一天来回。",
  bacalar:"巴卡拉尔七色湖（Bacalar）：淡水泻湖，游湖、漂流，住湖边。"};
const YUC_NOTE="下面每个地方都有自己的页面，点带下划线的名字就能打开，看门票、开放时间和详细玩法。";
/* 当前页面的景点写详细版，其他景点写简短版 */
const yucPlay=(self,keys)=>[{h:"玩什么（网友推荐）"},YUC_NOTE,...keys.map(k=>k===self?YUC_W[k]:YUC_S[k])];
const YUC_ROUTE=[...yucPlay("cancun",["cancun","mujeres","xpark","playa","cozumel","tulum","gran","dos","chichen","bacalar"]),
  {h:"9 天深度游或 5 天精简游"},"route:yuc",
  {src:"来源：Xcaret、Xel-Há、Xplor 官网（票价和开放时间）、INAH 官网和 2024 年公告（奇琴伊察、图卢姆遗址开放时间），2026 年 10 月查询；小红书笔记「🇲🇽 墨西哥特种兵日记+路线推荐｜坎昆篇 🌴」（@硅谷娇妻和她的长工）、「坎昆必去｜女人岛Isla Mujeres交通全攻略」（@River的旅行日记）、「女人岛一日游🏝️超级轻松的懒人闲逛指南」（@鹿鹿子luna）、「墨西哥旅游🇲🇽坎昆女人岛➕美食住宿Vlog」（@兔兔丁）、「墨西哥坎昆度假xcaret 八大园区别乱选？」（@Kevin李的世界城市故事）、「xel ha一日游体验（微避雷）」（@专业划水喵）、「🇲🇽Cozumel科苏梅尔岛｜必打卡景点美食攻略」（@禾野野）、「我后悔没早点来这里…比马尔代夫还离谱的海」（@Bauerschwein）、「Playa del Carmen 游记」（@杜德）、「墨西哥🇲🇽图鲁姆Tulum吃住玩夯拉牌行榜」（@nikobaby™）、「大数据推给正在做Tulum攻略的人！别盲目跟风」（@avec_clara）、「墨西哥天坑之\"乌龟坑\" | Gran Cenote」（@壮游大韪）、「墨西哥坎昆度假继续打卡——Grand Cenote」（@ChensFlavor 晨味）、「Tulum其中两个cenote」（@Dino）、「出片友好旅行| 🇲🇽Tulum网红双天坑自由行」（@鎏遛琉）、「图卢姆挺好的，下次不来了🤣」（@Lucky Mario）、「Chichen Itza奇琴伊察｜自驾真实信息分享」（@🎐(秋招版)）、「奇琴伊察半日游（自驾）小tips，含天坑」（@优酱灬）、「🇲🇽赌你没看过夜晚的金字塔」（@森尔卡杨）、「墨西哥旅游🇲🇽Bacalar七彩湖值得玩的地方」（@兔兔丁）、「墨西哥旅游🇲🇽Bacalar乘浮桥船游览七彩湖」（@兔兔丁）、「一湖七色｜马尔代夫平替就在墨西哥Bacalar」（@分岔的画圆）；评分来自 Google 地图（2026 年 10 月）。"}];
const YUC_STAY_ELSEWHERE=(where,extra)=>[`走这条路线时不用住在这里：${where}`].concat(extra||[]);
GUIDE.cancun={
 food:["网友说坎昆物价不低，全包酒店之外的小店也很好吃；酒店区的店贵一些，市区（El Centro）便宜、更地道。",
  {name:"La Berrinchuda",q:"La Berrinchuda Cancún",pid:"ChIJeXE8n6QrTI8Rz_9Renk7gWo",r:4.9,n:340,price:"人均 100–200 比索（Google）",note:"在市区 Av. Cobá 83。网友七天来了两次，taco、fajita、烤鸡都好吃，推荐酸角汁（Tamarindo）解腻。"},
  {name:"Puerto Santo",q:"Puerto Santo Cancún",pid:"ChIJBy3fK7wuTI8R0n9HJvvwhlw",r:4.6,n:3423,price:"人均 400–900 比索（Google）",note:"在 Puerto Juárez 码头边的沙滩上吃饭，旁边有木栈桥好拍照。两篇笔记都推荐：巧克力蛤（Chocolata Clam）、芒果咖喱 ceviche、蓝玉米饼包章鱼的 Tanquitos、玉米蛋糕；也有网友觉得生吃的蛤有点腥。"},
  {name:"Changarro de la 30 Las Palapas",q:"Changarro de la 30 las palapas Cancún",pid:"ChIJb60i5I4tTI8RvRTyN9AU2Qo",r:4.8,n:801,price:"人均 100–200 比索（Google）",note:"市区夜市旁的 taco 小店，基本都是本地人。网友推荐 ribeye 和 striploin 牛肉 taco，建议中午去，现烤更香；6 个 taco 加一瓶可乐约 320 比索。"},
  {name:"Los Amigos Cantina & Mexican Food",q:"Los Amigos Cantina Mexican Food Cancún",pid:"ChIJ4eW4FUkpTI8RfWqcIyLXfpE",r:5.0,n:351,price:"人均 100–500 比索（Google）",note:"酒店区的小店。网友推荐牛肉 fajitas 和 taco，分量够，两人加小费 700 多比索。"},
  {name:"Fred's",q:"Fred's The best seafood in Cancun",pid:"ChIJCaot178oTI8RZ0pdSbvuIro",r:4.8,n:7842,note:"酒店区的海鲜餐厅。网友专门来吃巧克力蛤，结果不是季节没吃到。"},
  {name:"Pescas Nader（小红书上写的是 Las Tostadillas del Mar）",q:"Pescas Nader Cancún",pid:"ChIJQZ9jTAAsTI8RNInY7ybeHlE",r:4.5,n:1799,price:"人均 200–300 比索（Google）",note:"市区 Av Nader 和 calle Rubia 路口，Google 上现在叫 Pescas Nader。网友说 130 比索的海鲜汤（Sopa de Mariscos）有一整只螃蟹、虾、鱿鱼和吞拿鱼，很鲜。"},
  {h:"夜市和市场"},
  "[[pid:ChIJq_CpNwcsTI8RucHSC99UCho|Parque de las Palapas Cancún|拉斯帕拉帕斯公园（Parque de las Palapas）]]：Google 4.4 ★（34,746 条），晚上有夜市。网友推荐 Marquesitas：黄油薄脆卷 Nutella 和水果，很脆。",
  {src:"来源：小红书笔记「我愿称之坎昆之光！！」（@诗人橙）、「🇲🇽坎昆｜酒店外跟着xhs🍠📕吃竟然0踩雷」（@煎蛋撒白糖🍳）、「🏝️ 坎昆宝藏海景餐厅推荐｜在沙滩上吃饭饭」（@小猪西瓜爱做梦）、「穷鬼夫妻拒绝全包🌴坎昆怎么吃饭」（@丝瓜一号）、「Fred‘s The Best Seafood in Cancun」（@Rose Sweet🍑）、「墨西哥坎昆最好吃的海鲜汤！！！」（@梦男Monica）、「为了18张照片我飞了一趟墨西哥坎昆🇲🇽」（@Serena的旅行箱）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
 hotel:["走 9 天或 5 天路线时，第 1–2 晚住坎昆酒店区（Zona Hotelera）。很多人选全包酒店（All Inclusive）。网友建议：不带孩子可以选成人专属（Adults Only）；想要安静的私人沙滩选海滨（beach front）房；「7」字形区域的海更好看。","Google 地图没有给出固定房价，下面按酒店类型分成三档，实际房价以预订网站为准。",
  {h:"坎昆 · 高端"},
  {name:"Atelier Playa Mujeres",q:"Atelier Playa Mujeres",pid:"ChIJa_FvlQIuTI8RPu24vQGjakM",r:4.8,n:9673,note:"Google 标为五星，成人专属全包，在酒店区北边的 Playa Mujeres。网友二刷还住这家：房间、服务、香氛都舒服，全包餐厅水准高；缺点是房间离海边远、海不如「7」字区好看。"},
  {name:"Turquoize at Hyatt Ziva Cancún",q:"Turquoize at Hyatt Ziva Cancun",pid:"ChIJXzKbdqAoTI8RKgLvQs3s5oc",r:4.7,n:707,note:"Google 标为五星，成人专属，在「7」字区的尖角上。网友说海景绝美、布局舒服，是住过三家里最喜欢的；但老酒店有点年头，食物一般。"},
  {h:"坎昆 · 中档精品"},
  {name:"Hotel Riu Palace Kukulkan",q:"Hotel Riu Palace Kukulkan Cancún",pid:"ChIJj8uQgIMpTI8RYGlJ-mEnvYI",r:4.5,n:2158,note:"Google 标为五星，全包。网友说性价比高、房间宽敞，墨西哥菜餐厅好吃；自助餐和鸡尾酒一般。"},
  {name:"Oleo Cancún Playa",q:"Oleo Cancun Resort All Inclusive",pid:"ChIJx0ANKHeDTo8RaNE1pyBMv5s",r:4.3,n:4304,note:"Google 标为四星，「7」字区里少见的小型全包，黑白简洁风，有海景。网友说性价比高，餐厅只有三四家，酒水偏淡，躺椅要早起占。"},
  {h:"坎昆 · 经济"},
  {name:"Hotel NYX Cancún",q:"Hotel NYX Cancun",pid:"ChIJvb4fposoTI8RjT8FPzaM_6c",r:4.5,n:8829,note:"Google 标为四星，在酒店区，网友说「极致性价比」，适合白天出去玩、只回来睡觉；对面走 5 分钟有商场。"},
  {src:"来源：小红书笔记「二刷坎昆🇲🇽住的还是这两个酒店！」（@Kylee的北美日记📔）、「坎昆全包酒店｜生命就应该浪费在这种地方」（@🍂Jancy）、「在坎昆，住进了性价比超赞的梦中情房」（@Just Emily）、「去过坎昆十几次🌳给大家分享5️⃣家小众酒店」（@Erika-Cancunnotes）、「Cancun 的一些小Tips」（@shirleyQ）；评分来自 Google 地图（2026 年 10 月）。"}]};
GUIDE.mujeres={
 food:["女人岛是一日游，网友多在北海滩和最南端附近吃。北海滩右手边有很多海边餐厅和饮料店，网友说椰子比酒店区便宜。",
  {name:"Ulan Eatery",q:"Ulan Eatery Isla Mujeres",pid:"ChIJ80EdRwAlTI8RDfHft26GDV8",r:4.9,n:228,price:"人均 100–600 比索（Google）",note:"在岛的南边，小木屋风格，连着一间手作艺术品店。网友点了 taco 加啤酒的下午茶套餐，味道在线；有网友去的那天没开门，建议先确认营业。"},
  {name:"Kin Ha",q:"Kin ha Isla Mujeres Restaurant",pid:"ChIJ5V-e2FAlTI8RHmYMNajkWaQ",r:4.4,n:1712,price:"人均 100–700 比索（Google）",note:"海边的餐厅，有躺椅和皮划艇，可以待一下午。网友最推荐脆虾 taco。Google 上有网友说入场要付 600 比索。"},
  {src:"来源：小红书笔记「🇲🇽坎昆必去！绝美Isla Mujeres一日游攻略」（@一颗梨涡圆）、「墨西哥旅游🇲🇽坎昆女人岛➕美食住宿Vlog」（@兔兔丁）、「女人岛一日游🏝️超级轻松的懒人闲逛指南」（@鹿鹿子luna）；Kin Ha 入场费参考 Google 地图评论。评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
 hotel:YUC_STAY_ELSEWHERE("女人岛是一日游，晚上坐船回坎昆住，酒店看坎昆页面的「酒店推荐」。",["想在岛上住的话，网友推荐 [[pid:ChIJH-a5oWglTI8RgthQW_GBrNM|Impression Isla Mujeres by Secrets|Impression Isla Mujeres by Secrets]]（Google 4.4 ★（456 条），五星全包）：很安静放松，晚餐要提前预约；房间有点潮湿，雨季风大时水上活动会取消。",{src:"来源：小红书笔记「不愧是小马代🩵坎昆女人岛Impression测评🫧」（@Albeeeee🐝）；评分来自 Google 地图（2026 年 10 月）。"}])};
GUIDE.playa={
 food:["网友说普拉亚吃的比坎昆好，第五大道（Quinta Avenida）一带餐厅多，但质量不一，先看 Google 评分；有的店结账容易被多收，先问清楚。",
  {name:"Las Hijas de la Tostada（38 街店）",q:"Las Hijas de la Tostada Calle 38 Playa del Carmen",pid:"ChIJyVv45a1DTo8RWJcJgpl_vqs",r:4.5,n:2123,price:"人均 200–600 比索（Google）",note:"两篇笔记都推荐 38 街这家的烤虾，有网友一晚吃了 16 只；认准 38 街。"},
  {name:"Mariskinky",q:"Mariskinky Playa del Carmen",pid:"ChIJq6raxitDTo8RQT_GOMa93Bc",r:4.5,n:2490,price:"人均 200–600 比索（Google）",note:"海鲜店。网友推荐章鱼饭，Garlic butter 口味最好吃，芒果汁好喝。"},
  {name:"Primo",q:"Primo Playa del Carmen",pid:"ChIJocPv8S9DTo8ROG71P-7U0UE",r:4.7,n:1123,note:"偏小 fine dining 的墨西哥菜，地段好，网友说份量不小、环境轻松。"},
  {name:"Piaggia Restaurante",q:"Piaggia Restaurante Playa del Carmen",pid:"ChIJp8MnuOxdTo8RvT_QNuDLI24",r:4.8,n:1508,note:"海边的意大利餐厅，适合约会；网友建议预约时要海边的桌子，推荐蛤蜊（almejas）。"},
  {name:"Quinta Parrilla",q:"Quinta Parrilla Playa del Carmen",pid:"ChIJ59Q7_flDTo8Rie3bYDtliMQ",r:4.6,n:407,price:"人均 200–600 比索（Google）",note:"烤肉店，网友去了两次，说烤鸡外脆里嫩、两种酱很绝，海鲜吃腻了可以来；Google 上也有人觉得牛肉串没味道。"},
  {name:"Tropical Tacos",q:"Tropical Tacos Playa del Carmen",pid:"ChIJR_n43VFDTo8RywpjemMc6jw",r:4.6,n:552,price:"人均 200–300 比索（Google）",note:"潜导推荐的 taco 店，网友说约 5 美元一个、性价比高，金枪鱼刺身新鲜，晚上有演出。"},
  {name:"El Fogón",q:"El Fogón Playa del Carmen",pid:"ChIJGZc9wSVDTo8RWOn9pvVTicI",r:4.5,n:13325,price:"人均 100–300 比索（Google）",note:"网友评价两极：有人说 taco 和烤肉现烤、外焦里嫩，一个约 30 比索；也有人说店里很热、招牌 El Fogoncito 猪肉偏柴。"},
  {name:"Mariscos y Clamatos El Doctorcito",q:"Mariscos y Clamatos El Doctorcito Playa del Carmen",pid:"ChIJFXHU5iRDTo8RW51rvl4oZ1c",r:4.5,n:5200,price:"人均 300–400 比索（Google）",note:"加勒比海边做法的海鲜，网友推荐 ceviche 和生吃的 Pata de mula；也有网友专门来吃巧克力贝，觉得海鲜不太新鲜。"},
  {src:"来源：小红书笔记「playa del Carmen 恨自己没有五个胃」（@XY不是xxy）、「Playa Del Carmen非网红美食指南」（@八毛一斤猫）、「在Playa del Carmen🇲🇽吃到的好吃的饭」（@是老张nei）、「来playa del carmen的朋友们一定要去吃这虾」（@科苏梅尔钉子户）、「Playa der Carman的酒店- Grand Hyatt」（@JADE Dream）、「为了18张照片我飞了一趟墨西哥坎昆🇲🇽」（@Serena的旅行箱）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
 hotel:["走 5 天路线时，第 3–4 晚住普拉亚德尔卡门。网友建议住第五大道附近，走路就能到海边和餐厅；去科苏梅尔的码头也在市区。","Google 地图没有给出固定房价，下面按酒店类型分成三档，实际房价以预订网站为准。",
  {h:"普拉亚德尔卡门 · 高端"},
  {name:"Devossion by Live Aqua Playa del Carmen",q:"Devossion By Live Aqua Playa del Carmen",pid:"ChIJKYu64cpDTo8RHnva6de072E",r:4.4,n:439,note:"Google 标为五星，全包，在市区海边。两篇笔记都住过：服务和餐厅都没踩雷，网友推荐海鲜餐厅的汤、意大利餐厅的海鲜烩饭和牛排。"},
  {h:"普拉亚德尔卡门 · 中档精品"},
  {name:"The Reef 28",q:"The Reef 28 Hotel Playa del Carmen",pid:"ChIJbSUPuihDTo8RK9BjdHk6RKU",r:4.4,n:3738,note:"Google 标为四星，成人专属全包。网友说只有三个餐厅但水准不错，意大利餐厅要提前预约；每人加 15 美元能去同集团另外两家酒店用设施和餐厅。"},
  {h:"普拉亚德尔卡门 · 经济"},
  "小红书上没找到普拉亚的经济型酒店推荐，下面两家参考 Google 地图评论。",
  {name:"Maui Hostel Playa Del Carmen",q:"Maui Hostel Playa Del Carmen",pid:"ChIJW1Hi__hCTo8RJH_hURUtUOs",r:4.6,n:665,note:"青旅，离海边很近。网友说位置好、工作人员会组织活动，氛围热闹；也有人说顶楼酒吧晚上吵、床位挤，不提供浴巾。"},
  {name:"3B Wellness Hotel & Hostel",q:"3B Wellness Hotel Hostel Playa del Carmen",pid:"ChIJq47A_DtDTo8RfOyRDEwZAUA",r:4.3,n:1029,note:"Google 标为二星，在市中心 10 街（10 Av. Sur），离海滩两个街区。有多人间（带储物柜）和私人房，有厨房、泳池和健身房，网友说很干净、周围安静；有背包客说住客多是长住的年长客人，想交朋友的话这里不热闹。"},
  {src:"来源：小红书笔记「墨西哥PDC躺平酒店推荐」（@一蹦三尺高）、「Playa del Carmen 游记」（@杜德）、「playa del Carmen 恨自己没有五个胃」（@XY不是xxy）、「🌴 Playa del Carmen攻略｜住海边 逛5th」（@加勒比海边小房东）；两家经济型住宿参考 Google 地图评论。评分来自 Google 地图（2026 年 10 月）。"}]};
GUIDE.cozumel={
 food:["科苏梅尔是一日游，网友多在码头附近的镇上吃。",
  {name:"Jolly: Coffee And Late Breakfast",q:"Jolly Coffee And Late Breakfast Cozumel",pid:"ChIJu8T2hD1ZTo8RpD3TLiCWX5A",r:4.8,n:1957,price:"人均 200–300 比索（Google）",note:"网红早午餐咖啡店，装修明亮，墙上挂满手绘插画。"},
  {name:"La Chi Breakfast",q:"La Chi Breakfast Cozumel",pid:"ChIJ44B9Co1ZTo8RffEbBl0jHOA",r:4.9,n:1071,price:"人均 100–200 比索（Google）",note:"当地人说是「妈妈味道」的早餐店，招牌是 The Stuffed Chilaquiles。"},
  {name:"Fuego Restaurant Cozumel",q:"Fuego Restaurant Cozumel",pid:"ChIJ6Ti_zntZTo8Re2244RmcMMs",r:4.8,n:2780,note:"海景餐厅，必点同名鸡尾酒 Fuego Cocktail；想看日落订 5:30–6:00 的海边座位。"},
  {name:"Guisados",q:"Guisados Cozumel",pid:"ChIJH5ZlQpRZTo8R35yD7ADGqK0",r:4.8,n:1616,price:"人均 100–200 比索（Google）",note:"平价地道的 taco 店，网友建议早点去，过了中午热门口味容易卖完。"},
  {src:"来源：小红书笔记「🇲🇽Cozumel科苏梅尔岛｜必打卡景点美食攻略」（@禾野野）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
 hotel:YUC_STAY_ELSEWHERE("科苏梅尔是从普拉亚出发的一日游，晚上坐船回普拉亚住，酒店看普拉亚德尔卡门页面的「酒店推荐」。",["想住岛上专门潜水的话，网友住过两家全包：[[pid:ChIJiV9GqspTTo8R8-Ak2r6-LHo|Occidental Cozumel|Occidental Cozumel]]（Google 4.5 ★（7,272 条），五星）环境安静、能看到长鼻浣熊，酒店里走路就能到潜店；[[pid:ChIJjeE8tNZQTo8R1lqMcEehzjY|The Explorean Cozumel|The Explorean Cozumel]]（Google 4.6 ★（1,829 条），四星）。",{src:"来源：小红书笔记「我后悔没早点来这里…比马尔代夫还离谱的海」（@Bauerschwein）、「Cozumel |墨西哥科苏梅尔攻略与避雷」（@安迪家的杰西卡）、「墨西哥Cozumel岛宝藏全包酒店Explorean」（@不爱冒险的罗罗）；评分来自 Google 地图（2026 年 10 月）。"}])};
GUIDE.xpark={
 food:["X 系列乐园里吃饭基本在园区内，买票时注意套餐含不含餐：官网上 Xcaret Plus 含自助餐，Xel-Há 全包票含吃喝（2026 年 10 月查询）。",
  "网友说 Xel-Há 有三家餐厅，在进门的红区和黄区，9 点到 5 点随时吃，最后一家 5:30 关门不通融；菜有烤猪肋排、鱼排、墨西哥菜和意面，味道还可以。Xel-Há 早餐供应到 11 点。",
  {src:"来源：Xcaret、Xel-Há 官网（2026 年 10 月）；小红书笔记「坎昆🇲🇽 | Xeiha乐园怎么玩？带你花式落水」（@罗毛蛋的世界）、「xel ha一日游体验（微避雷）」（@专业划水喵）、「Xel-ha的游玩攻略」（@Azalea Young）。"}],
 hotel:YUC_STAY_ELSEWHERE("X 系列乐园离普拉亚很近，晚上住普拉亚德尔卡门，酒店看普拉亚页面的「酒店推荐」。",[{h:"想住乐园自己的酒店"},
  {name:"Hotel Xcaret México",q:"Hotel Xcaret México",pid:"ChIJTRZdG3pETo8RhH9J4CfBw9A",r:4.6,n:20295,note:"Google 标为四星，全包。网友说入住送 Xplor、Xel-Há 等 X 系列乐园门票，有专属接驳车；夜宵 taco station 很好吃。旺季（12–4 月）要提前 15–30 天订房，热门餐厅和活动要提前预约。"},
  {src:"来源：小红书笔记「墨西哥坎昆最权威的酒店Xcaret」（@Amanda_weiiii）、「墨西哥坎昆度假xcaret 八大园区别乱选？」（@Kevin李的世界城市故事）；评分来自 Google 地图（2026 年 10 月）。"}])};
GUIDE.tulum={
 food:["网友说图卢姆的好餐厅不少，镇中心（downtown）便宜，海边酒店区贵。",
  {name:"Taqueria La Chiapaneca",q:"Taqueria La Chiapaneca Tulum",pid:"ChIJ4-CuHKzWT48R7r3rF1tuvok",r:4.5,n:4066,price:"人均 100–200 比索（Google）",note:"镇中心的平价 taco 店，两篇笔记都推荐，有网友中午去了三次，最爱带猪皮的 taco。"},
  {name:"La Negra Tomasa",q:"La Negra Tomasa Tulum",pid:"ChIJO22eVazRT48ReD5TmZRH-PY",r:4.8,n:6997,price:"人均 200–400 比索（Google）",note:"海鲜餐厅，网友说盲点不踩雷。"},
  {name:"Tropitango",q:"Tropitango Tulum",pid:"ChIJ3xbwDmfXT48R2q-t2c-UijM",r:4.9,n:268,price:"人均 100–200 比索（Google）",note:"阿根廷老板的 taco 摊，网友 5 天吃了 3 次：牛肉嫩配青酱，自制的油炸辣子又香又辣。"},
  {name:"WANG TULUM",q:"WANG TULUM",pid:"ChIJ831HQQfXT48RdNCmLNS-QJg",r:4.7,n:778,price:"人均 100–200 比索（Google）",note:"没有屋顶的辣味中餐馆，三篇笔记都提到：biangbiang 牛肉面（面现做）、上海辣油馄饨、担担面。坐在外面的板凳上吃。"},
  {name:"Hartwood",q:"Hartwood Tulum",pid:"ChIJlVcVFcvQT48Rdbm9qF4Emow",r:4.4,n:1582,price:"人均 1,000 比索以上（Google）",note:"海边酒店区的网红餐厅，没有固定菜单，每天写在木板上，要提前预订。网友推荐章鱼腿和鸡尾酒 Diablito；也有网友说章鱼烤焦了，酒水贵，账单直接收 18% 小费。"},
  {name:"Los Morros Tulum",q:"Los Morros Tulum",pid:"ChIJVYh7v9LXT48RP3ARhJIBXMc",r:4.5,n:807,price:"人均 200–700 比索（Google）",note:"网友说用料实、调酒清爽，几道有焦香的菜最出彩。"},
  {src:"来源：小红书笔记「墨西哥🇲🇽图鲁姆Tulum吃住玩夯拉牌行榜」（@nikobaby™）、「大数据推给正在做Tulum攻略的人！别盲目跟风」（@avec_clara）、「Tulum网红餐厅真实测评」（@大M小C在纽约）、「Tulum住宿美食篇！包含是否需要提前预约」（@二马同学）、「Tulum中餐天花板」（@爱旅行的coconut）、「🇲🇽Tulum图卢姆-又爱又恨的地方」（@Huiui）、「感谢xhs 我要把这家tulum餐厅评为米其林」（@揪你菠萝头🍍）；评分和价格区间来自 Google 地图（2026 年 10 月）。"}],
 hotel:["走 5 天路线时，第 1–2 晚住图卢姆。网友首推住镇中心（downtown）：吃饭、超市方便，路况好；海边（Tulum Beach）民宿能走到海滩，但路边不好停车。网友避雷镇中心往海边中间那一段：路差、水质差。很多海边酒店是自己打井抽水，网友说洗澡水有点咸。","Google 地图没有给出固定房价，下面按酒店类型分成三档，实际房价以预订网站为准。",
  {h:"图卢姆 · 高端"},
  {name:"La Zebra Tulum",q:"La Zebra Tulum",pid:"ChIJv2GoULXQT48RSQG69AxwRw4",r:4.6,n:2312,note:"Google 标为四星，SLH 旗下，在海边。网友说很多图卢姆酒店只收成人，这家可以带小朋友；餐厅也很出圈。"},
  {name:"Azulik",q:"Azulik Resort Tulum",pid:"ChIJ6QoQx1P-zYURehYSNToLc90",r:3.7,n:2322,note:"老牌网红树屋酒店，住客可以免费进旗下两个艺术空间，日落时去鸟巢餐厅 Kin Toh 喝一杯。注意 Google 评分只有 3.7。"},
  {h:"图卢姆 · 中档精品"},
  {name:"NABOA Hotel",q:"NABOA Hotel Tulum",r:4.9,n:143,note:"新开的侘寂风精品酒店，房间大、人少、有管家，餐厅好吃但出餐慢；位置偏，网友建议租车。"},
  {h:"图卢姆 · 经济"},
  "网友首推镇中心的民宿，房型选择多；小红书上没找到具体的经济型酒店推荐，下面两家都在镇中心，参考 Google 地图。",
  {name:"Che Tulum Hostel & Bar",q:"Che Tulum Hostel & Bar",pid:"ChIJ9zrpNVTRT48RDBdCs0V_DI0",r:4.3,n:965,note:"Google 标为二星，在镇中心。屋顶露台有按摩浴缸，街对面有联合办公空间；网友说工作人员热情，旅舍组织的社交活动容易交到朋友，独自旅行也觉得安全。也有人说套房里有异味、客厅灯关不掉。"},
  {name:"Hostel Oryx Tulum",q:"Hostel Oryx Tulum",pid:"ChIJ9x61lE_XT48R4Ey8ft1zYXU",r:4.6,n:361,note:"Google 标为二星，在镇中心 Calle Luna 一带。Google 地图上标注有泳池、免费早餐和免费停车，适合自驾。"},
  {src:"来源：小红书笔记「墨西哥🇲🇽图鲁姆Tulum吃住玩夯拉牌行榜」（@nikobaby™）、「大数据推给正在做Tulum攻略的人！别盲目跟风」（@avec_clara）、「为了18张照片我飞了一趟墨西哥坎昆🇲🇽」（@Serena的旅行箱）、「图卢姆挺好的，下次不来了🤣」（@Lucky Mario）；两家经济型住宿参考 Google 地图。评分来自 Google 地图（2026 年 10 月）。"}]};
GUIDE.grancenote={
 food:["天然井里不能带吃的，周边没有网友推荐的餐厅。大天然井离图卢姆镇只有 7 分钟车程，回镇上吃就好，餐厅看图卢姆页面的「餐厅美食」。",
  {src:"来源：自驾时间来自 Google 地图（2026 年 10 月）。"}],
 hotel:YUC_STAY_ELSEWHERE("大天然井从图卢姆过去 7 分钟，住图卢姆，酒店看图卢姆页面的「酒店推荐」。")};
GUIDE.dosojos={
 food:["网友说双眼天然井园区里有饭店和小卖部；也可以回图卢姆镇上吃，餐厅看图卢姆页面的「餐厅美食」。",
  {src:"来源：小红书笔记「出片友好旅行| 🇲🇽Tulum网红双天坑自由行」（@鎏遛琉）。"}],
 hotel:YUC_STAY_ELSEWHERE("双眼天然井从图卢姆镇过去约 25 分钟，住图卢姆，酒店看图卢姆页面的「酒店推荐」。")};
GUIDE.chichen={
 food:["奇琴伊察景区里只有卖纪念品的小摊和小卖部，网友建议带水。吃饭可以在附近的巴利亚多利德（Valladolid）小镇：有网友在那里吃到了墨西哥之行最好的一餐，也有网友去之前在 Valladolid 吃早饭。",
  {src:"来源：小红书笔记「【尤卡坦半岛】一日双飞，Ik Kil+奇琴伊查」（@FIRE Fighter Tim）、「【奇琴伊察、Ik-Kil天坑】自驾（蹭车）体验」（@小红鼠）。"}],
 hotel:YUC_STAY_ELSEWHERE("奇琴伊察是从图卢姆出发的一日游，晚上回图卢姆住。",["不想当天赶回去的话，网友推荐住巴利亚多利德（Valladolid）小镇：安静、没被过度开发，晚上 9 点城西南的教堂有露天光影秀。小红书上没找到具体的酒店推荐。",{src:"来源：小红书笔记「🇲🇽奇琴伊察+Ik Kil+Suytun一日游攻略｜坎」（@小张小张把钱花光）、「【尤卡坦半岛】一日双飞，Ik Kil+奇琴伊查」（@FIRE Fighter Tim）、「🇲🇽赌你没看过夜晚的金字塔」（@森尔卡杨）。"}])};
GUIDE.bacalar={
 food:["网友说巴卡拉尔的餐厅普遍上菜慢、关门早，很多只收现金；大部分是户外半开放、没有空调。有网友说这里是墨西哥吃得最好的地方，海鲜特别新鲜；推荐尝尝玛雅做法的烤鱼 Tikin Xic（香蕉叶包着慢烤），喝酸角汁（Tamarindo）。很多湖边酒店的餐厅也很好吃。",
  {name:"SAK",q:"SAK Bacalar",pid:"ChIJF0OOm52xW48RhwWSfyK_Geo",r:4.7,n:252,price:"人均 200–300 比索（Google）",note:"比较受欢迎的正餐餐厅，有屋顶露台；网友说上菜速度非常慢，赶时间不推荐。"},
  {name:"La Trattoria del '46",q:"La Trattoria Del 46 Bacalar",pid:"ChIJCR_V4mCxW48RKpDOPPY84mE",r:4.5,n:1399,price:"人均 200–600 比索（Google）",note:"意大利餐厅，披萨和意面都不错；结账默认加 15% 小费。"},
  {name:"Itzae Beach Club",q:"Itzae Beach Club Bacalar",pid:"ChIJDy0b9VC3W48RjGZdUk6vq10",r:4.4,n:334,note:"湖边的粉色水上秋千和吊床很出片，网友推荐虾肉 ceviche；Google 上网友说入场约 50 比索。"},
  {name:"La Playita",q:"La Playita Bacalar",pid:"ChIJfW_L0zixW48RtV43lZlpors",r:4.5,n:10925,price:"人均 200–600 比索（Google）",note:"湖边餐吧，比 Itzae 人少、清净，有漂亮的栈桥，拍照不容易拍到路人；网友说吃的中规中矩。"},
  {name:"La Bendición de Dios",q:"La Bendición de Dios Bacalar",pid:"ChIJlaEG8kexW48RhrhRRPWwOoM",r:4.4,n:884,price:"人均 100–200 比索（Google）",note:"本地人吃的馆子，各种卷饼一份 100 比索以内，冰饮 25 比索；有会英语的店员。"},
  {h:"顺路：切图马尔（Chetumal）"},
  {name:"Ámbar del Mar Restaurante de Mariscos",q:"Ámbar del Mar Restaurante de Mariscos Chetumal",pid:"ChIJ44bIJkqjW48R6VPxO5E84PM",r:4.6,n:1234,price:"人均 200–500 比索（Google）",note:"在切图马尔，去机场前可以顺路吃。网友说海鲜量大、好吃，能眺望伯利兹方向，在网友吃过的三家餐厅里最推荐。"},
  {src:"来源：小红书笔记「墨西哥Bacalar比马尔代夫还chill」（@Jun的生活📝）、「墨西哥旅游🇲🇽Bacalar七彩湖值得玩的地方」（@兔兔丁）、「一湖七色｜马尔代夫平替就在墨西哥Bacalar」（@分岔的画圆）、「🇲🇽爱上在Bacalar当野人的感觉(附攻略」（@無添加日记）、「在墨西哥发现“七色湖”比坎昆安静Bacalar」（@墨西哥红黑榜）、「Bacalar酒店体验 our habitas bacalar」（@松香小雪）；Itzae 入场费参考 Google 地图评论。评分和价格区间来自 Google 地图（2026 年 10–11 月）。"}],
 hotel:["建议住 2 晚，一定住湖边、选带码头或阳台的房间，早上起来就能看湖。网友说 Cenote Azul 到 Ecoparque 一段的湖景最好看，偏一点的地方湖水没那么蓝。这里基本都是小型精品酒店，旺季提前订；很多酒店免费借皮划艇和桨板。","Google 地图没有给出固定房价，下面按酒店类型分成三档，实际房价以预订网站为准。",
  {h:"巴卡拉尔 · 高端"},
  {name:"Khaban Bacalar Hotel",q:"Khaban Bacalar Hotel",pid:"ChIJOxaOkoyzW48RoBri_E4uZQQ",r:4.4,n:330,note:"Google 标为四星，网友说更安静、偏度假型，湖景很漂亮，含早餐。"},
  {name:"Habitas Bacalar",q:"Habitas Bacalar",pid:"ChIJC_3RejexW48R_5Ix2wqoNTs",r:4.5,n:508,note:"Google 标为五星，34 间湖边小木屋，分正对泻湖、后排高脚屋和看不到湖的丛林房。网友说酒店餐厅很好吃，基本不用出去；有日出、日落桨板和游船活动；房间没信号，只有 WiFi。从切图马尔机场打 DiDi 约 250 比索。"},
  {h:"巴卡拉尔 · 中档精品"},
  {name:"Carolina Bacalar",q:"Carolina Bacalar",pid:"ChIJA5aznCq3W48REl6q61Fzo5Q",r:4.5,n:437,note:"Google 标为四星，临湖。网友超级推荐：免费提供皮划艇和桨板，早上直接从酒店划出去看日出；酒店餐厅好吃划算。"},
  {name:"Hotel Isabella Bacalar Lagoon Front",q:"Hotel Isabella Bacalar Lagoon Front",pid:"ChIJu7coJwCxW48RQ0xQj3jfnxc",r:4.7,n:145,note:"就在湖边，有自己的码头，含早餐，网友说性价比很不错。"},
  {name:"BoaBoa Bacalar Hotel",q:"BoaBoa Bacalar Hotel",pid:"ChIJ70DeUFmxW48Ra0n7rhkDNe4",r:4.7,n:477,note:"沿湖的小木屋，网友说含早餐，桨板、船和救生衣可以免费用。"},
  {name:"Casa Árabe",q:"Casa Árabe Bacalar",pid:"ChIJ7_L8mCq3W48RQQ1xKeHu5VA",r:4.4,n:417,note:"Google 标为三星，临湖，网友在这里集合坐船，说环境安静干净，下次想住这里。"},
  {h:"巴卡拉尔 · 经济"},
  {name:"Che Bacalar Hostel & Bar",q:"Che Bacalar Hostel",pid:"ChIJ9QxIM5OxW48RzhQEh598MIg",r:4.2,n:522,note:"青旅，两篇笔记都推荐：有湖景高层、泳池和大厨房，活动多；网友说十人间一晚 100 多比索，可以帮忙叫出租车。"},
  {src:"来源：小红书笔记「墨西哥Bacalar比马尔代夫还chill」（@Jun的生活📝）、「Bacalar｜生活再也无法复制出相同时刻」（@Lucky Mario）、「墨城出发Bacalar 3天2晚攻略」（@糖月月）、「墨西哥旅游🇲🇽Bacalar七彩湖值得玩的地方」（@兔兔丁）、「一湖七色｜马尔代夫平替就在墨西哥Bacalar」（@分岔的画圆）、「墨西哥bacalar攻略🌊🌊」（@Dino）、「🇲🇽爱上在Bacalar当野人的感觉(附攻略」（@無添加日记）、「Bacalar酒店体验 our habitas bacalar」（@松香小雪）、「🇲🇽蓝调秘境｜Bacalar泄湖攻略」（@甜椒肉丝）；评分来自 Google 地图（2026 年 10–11 月）。"}]};
/* 海岛游：坎昆用 9 天 / 5 天大路线；图卢姆和普拉亚共用 5 天路线；其他地点各写各的交通和行程。 */
GUIDE.cancun.transport=YUC_TRANSPORT;GUIDE.cancun.route=YUC_ROUTE;
const RM5_WARN={warn:"提示：下面是 5 天走全的玩法，可以按自己的时间和兴趣删掉一些地方。比如不想跑远就不去奇琴伊察，天然井二选一或都不去，不浮潜、不潜水可以不去科苏梅尔。"};
const RM5_TRANSPORT=[RM5_WARN,{h:"建议游玩路线：坎昆机场 → 图卢姆 → 普拉亚德尔卡门 → 坎昆机场"},
  "map:rm5",
  "leg:u","leg:r","leg:ad","leg:ae","leg:v","leg:z","leg:x",
  "[[link:https://www.google.com/maps/dir/Aeropuerto+Internacional+de+Canc%C3%BAn/Tulum+Centro/Playa+del+Carmen/Aeropuerto+Internacional+de+Canc%C3%BAn|在 Google 地图打开这条路线导航]]",
  {h:"坐船"},
  "科苏梅尔：[[link:https://ultramarsales.ultramarferry.com/en/ferry-cozumel.php|Ultramar 官网]]显示从普拉亚码头出发 9:00–21:00 一天约 9 班，成人单程 320 比索、往返 640 比索（2026 年 10 月查询）。",
  {h:"注意"},
  "租车：网友建议租 SUV，图卢姆一带土路多、很颠；租车常被要求加买保险，提前看清楚条款。很多路段没有信号，一定要下载离线地图。",
  "打车：网友说图卢姆基本叫不到 Uber、DiDi，多靠租车、colectivo 小巴或出租车；普拉亚 2026 年 10 月起可以叫 Uber，接单的是出租车。",
  "季节：网友说 8–10 月雨多风大，可能遇到飓风，浮潜和出海常被取消；有些季节海滩会被海藻占满。",
  {src:"来源：Ultramar 官网（船票和时刻，2026 年 10 月查询）；小红书笔记「坎昆图卢姆PDC交通大法」（@YIYI的DIY旅行）、「CANCUN 坎昆交通-ADO 大红巴士🚌和打的🚖」（@加州小飞猪）、「挑战坎昆最经济出行—uber 打车实录」（@可爱岛岛）、「带三岁男娃勇闯坎昆-交通避雷」（@面面条条）、「🚗墨西哥Tulum自驾贴士」（@青原de世界观察日记🚂）、「大数据推给正在做Tulum攻略的人！别盲目跟风」（@avec_clara）、「Playa Del Carmen穷鬼35比索到Xcaret」（@🏂Ethan 单板滑雪）；自驾时间和距离来自 Google 地图（2026 年 11 月）。"}];
const RM5_SRC={src:"来源：INAH 官网和 2024 年公告（奇琴伊察、图卢姆遗址开放时间），2026 年 10 月查询；小红书笔记「🇲🇽坎昆三日你这样安排（非全包酒店篇」（@简格格J.的朋友圈🌍）、「坎昆最值得的一天：包车去琴奇伊察+双天坑🚗」（@一条_善河）、「坎昆⇌奇琴伊察大巴，2026.5.4亲测」（@Ca糖豆n豆儿dy）、「我后悔没早点来这里…比马尔代夫还离谱的海」（@Bauerschwein）、「墨西哥🇲🇽图鲁姆Tulum吃住玩夯拉牌行榜」（@nikobaby™）、「出片友好旅行| 🇲🇽Tulum网红双天坑自由行」（@鎏遛琉）、「墨西哥天坑之\"乌龟坑\" | Gran Cenote」（@壮游大韪）；评分来自 Google 地图（2026 年 10 月）。"};
const rm5Route=self=>[RM5_WARN,{h:"5 天行程"},"route:rm5",...yucPlay(self,["tulum","chichen","gran","dos","cozumel","playa"]),RM5_SRC];
GUIDE.tulum.transport=RM5_TRANSPORT;GUIDE.tulum.route=rm5Route("tulum");
GUIDE.playa.transport=RM5_TRANSPORT;GUIDE.playa.route=rm5Route("playa");

/* 大天然井、双眼天然井：住图卢姆时顺路玩 */
const CENOTE_TRANSPORT=[{h:"建议玩法：住图卢姆（Tulum）时顺路去，半天就够"},
  "map:cenote",
  "大天然井离图卢姆镇只有 7 分钟车程，双眼天然井约 27 分钟。适合住在图卢姆的时候抽半天去，也可以不去，看自己的时间安排。两个风格不一样：大天然井水池开阔、能和海龟一起游；双眼天然井是洞穴，适合跟向导浮潜看钟乳石。",
  "leg:ad","leg:ae",
  "[[link:https://www.google.com/maps/dir/Tulum+Centro/Gran+Cenote+Tulum/Cenote+Dos+Ojos|在 Google 地图打开这条路线导航]]",
  {h:"注意"},
  "网友说两个天然井都只收现金，带好比索；下水前必须淋浴、必须穿救生衣，为了保护水质不能涂防晒霜。",
  "网友建议早上去，人少、光线好；双眼天然井下午 5 点关门。",
  {src:"来源：小红书笔记「出片友好旅行| 🇲🇽Tulum网红双天坑自由行」（@鎏遛琉）、「墨西哥天坑之\"乌龟坑\" | Gran Cenote」（@壮游大韪）、「Tulum其中两个cenote」（@Dino）、「Playa Del Carmen穷鬼35比索到Xcaret」（@🏂Ethan 单板滑雪）；自驾、骑车时间和距离来自 Google 地图（2026 年 11 月）。"}];
const CENOTE_STAY=["不用住在这里。天然井只玩半天，建议住图卢姆（离得最近）、普拉亚德尔卡门或坎昆，酒店看这几个地点页面的「酒店推荐」。"];
GUIDE.grancenote.transport=CENOTE_TRANSPORT;GUIDE.dosojos.transport=CENOTE_TRANSPORT;
GUIDE.grancenote.route=["住图卢姆的时候顺路来，半天就够，不来也不影响整体行程。网友建议早上去，人少。",YUC_W.gran,"同一天还想再去一个，可以下午去双眼天然井，两个都在图卢姆附近。"];
GUIDE.dosojos.route=["住图卢姆的时候顺路来，半天就够，不来也不影响整体行程。网友建议工作日早上去，人少。",YUC_W.dos,"同一个园区里的[[map:Cenote Nicte-Ha|莲花池（Cenote Nicte-Ha）]]水下有睡莲，可以一起去。"];
GUIDE.grancenote.food=["大天然井周边没有找到网友推荐的餐厅，不单独推荐。离图卢姆镇只有 7 分钟，回镇上吃，看图卢姆页面的「餐厅美食」。"];
GUIDE.grancenote.hotel=CENOTE_STAY;GUIDE.dosojos.hotel=CENOTE_STAY;

/* 奇琴伊察：从坎昆酒店或图卢姆当天来回 */
GUIDE.chichen.transport=[{h:"怎么去：从坎昆酒店或图卢姆出发，当天来回"},
  "map:chichen",
  "奇琴伊察离坎昆酒店区开车约 2.5 小时、离图卢姆约 2 小时 12 分钟，都是一天来回。三种走法：自己开车或包车最自由；坐 Oriente 大巴最便宜；跟一日团最省心，但大巴团要沿路接人，时间长。",
  "leg:aa","leg:r",
  "[[link:https://www.google.com/maps/dir/Zona+Hotelera+Canc%C3%BAn/Chich%C3%A9n+Itz%C3%A1|从坎昆酒店区导航]]　[[link:https://www.google.com/maps/dir/Tulum+Centro/Chich%C3%A9n+Itz%C3%A1|从图卢姆导航]]",
  {h:"跟团（网友的经验）"},
  "坎昆沃尔玛超市门口的旅行社：网友付过 50–80 美元，一般含奇琴伊察、两个天然井和自助午餐，早上 6:30–7 点出发，晚上 7 点到 10 点多才回。便宜团一般会进黑曜石购物点。",
  "网上订的团：有网友在 Tripadvisor 上订到 50 加元，出发前被通知另交门票（环保维护费）765 比索；酒店报价是 300 加元。",
  "小团、私人团：网友付过 200 美元一人的 10 人小团（含门票和餐，7:45 接、晚上 7 点回）；从普拉亚出发的私人团 240 美元一人，6:30 出发、3:30 就能回。Xcaret 也有去奇琴伊察的团，网友说车上有厕所和冰饮，没有额外费用。",
  {h:"注意"},
  "时差：尤卡坦州比金塔纳罗奥州（坎昆、图卢姆）慢 1 小时。",
  "门票：官网没写遗址的票价；网友 2026 年 5 月付过 697 比索，可以刷卡。景区出口有免费厕所。",
  "自驾：快到景区时有人穿工作服拦车卖票、指路去私人停车场，都别停，开到官方停车场；后排也要系安全带。",
  {src:"来源：小红书笔记「坎昆⇌奇琴伊察大巴，2026.5.4亲测」（@Ca糖豆n豆儿dy）、「墨西哥 | 坎昆景点、坎昆去奇琴伊察交通攻略」（@牧羊少年）、「🇲🇽坎昆三日你这样安排（非全包酒店篇」（@简格格J.的朋友圈🌍）、「奇琴伊察一日游」（@麟渊Klording）、「坎昆最值得的一天：包车去琴奇伊察+双天坑🚗」（@一条_善河）、「坎昆至奇琴伊察一日游攻略」（@露十三娘）、「坎昆出发11h，奇琴伊察+双天坑，附攻略」（@坚决反对消费主义）、「避开人群Tulum➕奇琴伊察➕天坑小型tour推荐」（@一只🦉）、「坎昆出发奇琴伊察与图卢姆一日游体验」（@温哥华大头）、「Chichen Itza奇琴伊察｜自驾真实信息分享」（@🎐(秋招版)）；自驾时间和距离来自 Google 地图（2026 年 11 月）。"}];
GUIDE.chichen.route=[{h:"一天的走法"},"route:chichen",{h:"玩什么（网友推荐）"},YUC_W.chichen,
  {src:"来源：INAH 官网（2026 年 10 月查询）；小红书笔记「坎昆最值得的一天：包车去琴奇伊察+双天坑🚗」（@一条_善河）、「坎昆出发11h，奇琴伊察+双天坑，附攻略」（@坚决反对消费主义）、「🇲🇽 奇琴伊察自由行攻略 Valladolid出发」（@小杨）、「坎昆至奇琴伊察一日游攻略」（@露十三娘）、「墨西哥 | 巴亚多利德坐小巴去奇琴伊察」（@牧羊少年）。"}];
GUIDE.chichen.hotel=["奇琴伊察当天来回，晚上返回坎昆或图卢姆的酒店，酒店看这两个地点页面的「酒店推荐」。","不想当天赶回去的话，网友推荐住巴利亚多利德（Valladolid）小镇：安静、没被过度开发，晚上 9 点城西南的教堂有露天光影秀。小红书上没找到具体的酒店推荐。",{src:"来源：小红书笔记「🇲🇽奇琴伊察+Ik Kil+Suytun一日游攻略｜坎」（@小张小张把钱花光）、「【尤卡坦半岛】一日双飞，Ik Kil+奇琴伊查」（@FIRE Fighter Tim）、「🇲🇽赌你没看过夜晚的金字塔」（@森尔卡杨）。"}];

/* X 系列乐园：从坎昆酒店或图卢姆当天来回 */
GUIDE.xpark.transport=[{h:"怎么去：从坎昆酒店或图卢姆出发，当天来回"},
  "map:xpark",
  "Xcaret 在普拉亚德尔卡门（Playa del Carmen）南边，离坎昆酒店区开车约 1 小时 7 分钟、离图卢姆约 45 分钟。可以自驾、坐乐园的接送车、跟酒店旅行社的套餐，或者打车 / 坐 colectivo 小巴。",
  "leg:ab","leg:ac",
  "[[link:https://www.google.com/maps/dir/Zona+Hotelera+Canc%C3%BAn/Xcaret+Park|从坎昆酒店区导航]]　[[link:https://www.google.com/maps/dir/Tulum+Centro/Xcaret+Park|从图卢姆导航]]",
  {h:"打车（网友的经验）"},
  "从普拉亚打车：酒店前台说单程 450 比索，网友在路边打车付过 400 比索、约 14 分钟，说好时间司机会回来接。网友说普拉亚 2026 年 10 月起能叫 Uber（接单的是出租车），去 Xcaret 约 100 比索；但晚上看完秀出来很难叫到 Uber，只能坐门口的出租车，按门口价目表付钱。",
  "inDrive 也能叫车，但网友说只能付现金或用墨西哥银行卡。",
  "从图卢姆、坎昆打车比较贵，网友更推荐 colectivo 小巴或乐园接送；图卢姆基本叫不到 Uber。",
  {h:"住乐园酒店"},
  "住 Hotel Xcaret 的话，网友说坎昆机场 T3 出门右手边的棕色小房子里可以找到酒店的接驳车，大约一小时一班；酒店有到各个乐园的专属接驳车。",
  {src:"来源：小红书笔记「Playa Del Carmen穷鬼35比索到Xcaret」（@🏂Ethan 单板滑雪）、「CANCUN 坎昆交通-ADO 大红巴士🚌和打的🚖」（@加州小飞猪）、「挑战坎昆最经济出行—uber 打车实录」（@可爱岛岛）、「🇲🇽坎昆-Xcaret公园超全攻略📝」（@Bella）、「速通攻略：从坎昆机场去Xcaret」（@Acacia蕹花）、「墨西哥坎昆最权威的酒店Xcaret」（@Amanda_weiiii）；自驾时间和距离来自 Google 地图（2026 年 11 月）。"}];
GUIDE.xpark.route=[{h:"一天的走法"},"route:xpark",{h:"票价和开放时间"},YUC_W.xpark,
  {src:"来源：Xcaret、Xel-Há、Xplor 官网（票价和开放时间，2026 年 10 月查询）；小红书笔记「🇲🇽坎昆-Xcaret公园超全攻略📝」（@Bella）、「墨西哥坎昆度假xcaret 八大园区别乱选？」（@Kevin李的世界城市故事）、「xel ha一日游体验（微避雷）」（@专业划水喵）。"}];
GUIDE.xpark.hotel[0]="X 系列乐园当天来回，玩完返回坎昆、普拉亚德尔卡门或图卢姆的酒店，酒店看这几个地点页面的「酒店推荐」。";

/* 女人岛：从坎昆坐船上岛 */
GUIDE.mujeres.transport=[{h:"怎么上岛：从坎昆坐船约 30 分钟"},
  "map:mujeres",
  "去女人岛坐 Ultramar 的船，坎昆有三个码头：市区的 Puerto Juárez 班次最多；住酒店区的话，不用跑去市区，酒店区的 Playa Tortugas、Playa Caracol 两个码头就能直接坐船上岛，只是班次少，先查时刻表。",
  "leg:y",
  "[[link:https://www.google.com/maps/dir/Zona+Hotelera+Canc%C3%BAn/Ultramar+Puerto+Ju%C3%A1rez|从坎昆酒店区导航到码头]]",
  {h:"船票"},
  "[[link:https://ultramarsales.ultramarferry.com/en/ferry-isla-mujeres.php|Ultramar 官网]]显示从坎昆 Puerto Juárez 码头出发 5:30–23:00 基本半小时一班，酒店区的 Playa Tortugas、Playa Caracol 码头一天约 7 班；成人单程 290 比索、往返 580 比索，另收环境卫生费 36.56 比索；票 6 个月内任意班次可用，提前 30 分钟到码头（2026 年 10 月查询）。",
  "网友说在官网先买好往返票，邮箱收电子票，直接扫码上船；码头的自助机也能买，可以刷卡。有网友说现场买会多收码头费。",
  "回程：网友提醒下午 2:00–2:30 是个坎，错过之后下一班可能直接到 4 点；回码头前先看好时刻表。",
  {h:"到了岛上怎么走"},
  "岛长约 8 公里，北边的北海滩（Playa Norte）下船走 10–20 分钟就到；去最南端的 Punta Sur 要坐车。",
  "高尔夫球车：网友说坐船时有人推销 110 美元以上一天，偏贵，上岛后自己找租车点砍价，80 美元一天左右算合理；也有网友付过 2 小时 1,000 比索。租车要押驾照，记得带上。球车没有空调，岛上很晒。",
  "出租车：岛上叫不到 Uber，直接拦出租车，网友说北到南单程约 150 比索（10 美元），先谈价；也可以在码头右转约 30 米坐公交，网友说 12 比索。",
  {src:"来源：Ultramar 官网（船票和时刻，2026 年 10 月查询）；小红书笔记「去女人岛前一定要看｜Ferry + 高尔夫车+攻略」（@开花C🌸）、「2026 8月坎昆女人岛」（@Selina keke）、「女人岛一日游🏝️超级轻松的懒人闲逛指南」（@鹿鹿子luna）、「🌟坎昆女人岛攻略｜绝美果冻海+玛雅秘境」（@赵花花历险记）、「墨西哥旅游🇲🇽坎昆女人岛➕美食住宿Vlog」（@兔兔丁）、「女人岛 半日游之失望而归」（@小红鼠）、「来坎昆请一定要来女人岛🐬」（@西西是咕噜）；码头距离来自 Google 地图（2026 年 11 月）。"}];
GUIDE.mujeres.route=[{h:"一天的走法"},"route:mujeres",{h:"玩什么（网友推荐）"},YUC_W.mujeres,
  "也有网友下午才上岛、只去了北海滩，觉得和坎昆酒店区的海差不多；网友普遍说最南端的断崖最值得去。",
  {src:"来源：小红书笔记「女人岛一日游🏝️超级轻松的懒人闲逛指南」（@鹿鹿子luna）、「🌟坎昆女人岛攻略｜绝美果冻海+玛雅秘境」（@赵花花历险记）、「🇲🇽坎昆必去！绝美Isla Mujeres一日游攻略」（@一颗梨涡圆）、「2026 8月坎昆女人岛」（@Selina keke）、「去女人岛前一定要看｜Ferry + 高尔夫车+攻略」（@开花C🌸）、「女人岛 半日游之失望而归」（@小红鼠）；评分来自 Google 地图（2026 年 11 月）。"}];
GUIDE.mujeres.food.splice(GUIDE.mujeres.food.length-1,0,
  {name:"Ocean's",q:"Ocean's Isla Mujeres",pid:"ChIJbyVytN0xTI8RPDN1BMJ-Q2o",r:4.6,n:644,note:"步行街中间的海鲜餐厅，晚上有萨克斯演奏。网友推荐虾球和今日鲜鱼；章鱼量少，价格偏贵。半开放，下午太热，晚上有风更舒服。"},
  {name:"Rusticco Restaurante & Bar",q:"Rusticco Restaurante Isla Mujeres",pid:"ChIJnQROvs4xTI8RhSVGBr-SqbU",r:4.8,n:462,price:"人均 200–800 比索（Google）",note:"步行街中部，有空调。网友推荐龙虾班尼迪蛋；牛排煎得太老，不推荐。"});
GUIDE.mujeres.food[GUIDE.mujeres.food.length-1]={src:"来源：小红书笔记「🇲🇽坎昆必去！绝美Isla Mujeres一日游攻略」（@一颗梨涡圆）、「墨西哥旅游🇲🇽坎昆女人岛➕美食住宿Vlog」（@兔兔丁）、「女人岛一日游🏝️超级轻松的懒人闲逛指南」（@鹿鹿子luna）、「以我喜欢的方式记录🇲🇽坎昆女人岛🍔美食」（@喵喵柴）；Kin Ha 入场费参考 Google 地图评论。评分和价格区间来自 Google 地图（2026 年 10–11 月）。"};
GUIDE.mujeres.hotel=["大多数人当天来回，晚上坐船回坎昆住，酒店看坎昆页面的「酒店推荐」。想在岛上住一两晚的话，网友住过下面两家全包度假酒店，都比坎昆酒店区安静。","Google 地图没有给出固定房价，实际房价以预订网站为准。",
  {h:"女人岛 · 高端"},
  {name:"Impression Isla Mujeres by Secrets",q:"Impression Isla Mujeres by Secrets",pid:"ChIJH-a5oWglTI8RgthQW_GBrNM",r:4.4,n:456,note:"Google 标为五星，全包。网友说酒店用双体船从坎昆码头接人（约 40 分钟），天气不好改坐车和渡轮；有管家，无边泳池很美；晚餐要提前预约，餐厅中规中矩不踩雷。雨季风大时水上活动会取消。"},
  {name:"Almare, a Luxury Collection Resort",q:"Almare Luxury Collection Resort Isla Mujeres",pid:"ChIJyxgZm1ElTI8R6rP2UtuIQ5s",r:4.2,n:238,note:"Google 标为五星，成人专属全包。网友从 Puerto Juárez 坐 Ultramar 上岛再打车，车费酒店负责；墨西哥餐厅和意大利餐厅的披萨好吃；活动不多（皮划艇、桨板、瑜伽、烹饪课），适合喜欢安静的人。"},
  {src:"来源：小红书笔记「女人岛Impression by Secrets酒店体验」（@katbabyun）、「不愧是小马代🩵坎昆女人岛Impression测评🫧」（@Albeeeee🐝）、「女人岛Almare体验」（@说走就走的旅行主理人）；评分来自 Google 地图（2026 年 10–11 月）。"}];

/* 科苏梅尔：从普拉亚坐船上岛 */
GUIDE.cozumel.transport=[{h:"怎么上岛：从普拉亚德尔卡门坐船约 45 分钟"},
  "map:cozumel",
  "科苏梅尔岛在普拉亚德尔卡门（Playa del Carmen）对面，从普拉亚市中心海边的码头坐船过去。",
  "leg:z",
  {h:"船票"},
  "[[link:https://ultramarsales.ultramarferry.com/en/ferry-cozumel.php|Ultramar 官网]]显示从普拉亚码头出发 9:00–21:00 一天约 9 班，成人单程 320 比索、往返 640 比索（2026 年 10 月查询）。网友提醒不要在街上找人买船票，去正规售票处买。",
  {h:"到了岛上怎么走"},
  "岛上没有 Uber。出租车和三轮摩的都不打表，上车前先讲好价格；出租车一般在沿海的路边等客。",
  "想自己逛可以租车或小摩托：网友说小摩托约 500 比索一天、含第三方保险，要驾照和押金（押金建议付现金），还车前自己加满油。市中心都是单行道，停车难。",
  {src:"来源：Ultramar 官网（船票和时刻，2026 年 10 月查询）；小红书笔记「Cozumel完全攻略下（交通，餐厅）」（@Lyla）、「我后悔没早点来这里…比马尔代夫还离谱的海」（@Bauerschwein）。"}];
GUIDE.cozumel.route=[{h:"一天的走法"},"route:cozumel",{h:"玩什么（网友推荐）"},YUC_W.cozumel,
  {src:"来源：小红书笔记「我后悔没早点来这里…比马尔代夫还离谱的海」（@Bauerschwein）、「Cozumel完全攻略下（交通，餐厅）」（@Lyla）、「🇲🇽Cozumel科苏梅尔岛｜必打卡景点美食攻略」（@禾野野）；评分来自 Google 地图（2026 年 10–11 月）。"}];
GUIDE.cozumel.food.splice(GUIDE.cozumel.food.length-1,0,
  {name:"Taquería El Mexicano",q:"Taquería El Mexicano Cozumel",pid:"ChIJlcbixM1ZTo8RM2ya3yeISbY",r:4.8,n:748,price:"人均 100–200 比索（Google）",note:"苍蝇小店，网友说是镇上最好吃的 taco，炖牛肉（Suadero）很软烂，烤猪肉（Pastor）也好吃，很多当地人外带。"},
  {name:"El Chino Marinero II",q:"El Chino Marinero II Cozumel",pid:"ChIJN2i7481ZTo8RRIMfsaDw5cw",r:4.3,n:369,price:"人均 200–300 比索（Google）",note:"海鲜 taco 用料足、份量大，网友强烈推荐章鱼 taco。"},
  {name:"La Conchita del Caribe",q:"La Conchita del Caribe Cozumel",pid:"ChIJj2ghHH5XTo8RP_GcCNSUp7Y",r:4.5,n:2061,price:"人均 200–400 比索（Google）",note:"海鲜馆，网友说小贵但好吃，炒鱿鱼很推荐；结账时会主动要小费。"},
  {name:"La Estrella (The Star)",q:"La Estrella Cozumel",pid:"ChIJp5GSWNBZTo8R53Bl8Ns2dv4",r:4.4,n:769,price:"人均 100–500 比索（Google）",note:"海鲜馆，网友说菜单丰富，点菜基本不会出错。"});
GUIDE.cozumel.food[GUIDE.cozumel.food.length-1]={src:"来源：小红书笔记「🇲🇽Cozumel科苏梅尔岛｜必打卡景点美食攻略」（@禾野野）、「Cozumel完全攻略下（交通，餐厅）」（@Lyla）、「Cozumel科苏梅尔最爱taco店Guisados」（@Nicole）；评分和价格区间来自 Google 地图（2026 年 10–11 月）。"};
GUIDE.cozumel.hotel=["一日游的话，晚上坐船回普拉亚德尔卡门住，酒店看普拉亚页面的「酒店推荐」。想住岛上专门潜水、浮潜的话，网友住过下面几家，都是 Google 评分高的度假酒店。","Google 地图没有给出固定房价，实际房价以预订网站为准。",
  {h:"科苏梅尔 · 高端"},
  {name:"InterContinental Presidente Cozumel",q:"InterContinental Presidente Cozumel Resort Spa",pid:"ChIJazd0pzRXTo8R1otrMWTyJI4",r:4.6,n:1902,note:"Google 标为五星。网友说人少、安静，酒店海滩一下水就能浮潜：左边安全区约 8 米深，有珊瑚、沉船、龙虾，右边能看到大鱼，运气好有魔鬼鱼；酒店有潜店。"},
  {name:"Cozumel Palace All Inclusive",q:"Cozumel Palace All Inclusive Resort",pid:"ChIJAatowM9ZTo8RlaG01NVivh4",r:4.6,n:1807,note:"Google 标为五星，全包。网友说离机场不到 4 公里，坐接驳车每人 224 比索；有四个餐厅，可以在酒店 App 上点客房服务。"},
  {name:"Occidental Cozumel",q:"Occidental Cozumel",pid:"ChIJiV9GqspTTo8R8-Ak2r6-LHo",r:4.5,n:7272,note:"Google 标为五星，全包。网友说环境安静、能看到长鼻浣熊，酒店里走路就能到潜店。"},
  {name:"The Explorean Cozumel",q:"The Explorean Cozumel",pid:"ChIJjeE8tNZQTo8R1lqMcEehzjY",r:4.6,n:1829,note:"Google 标为四星，全包。"},
  {src:"来源：小红书笔记「🇲🇽Cozumel洲际｜沉船、魔鬼鱼浮潜随便看」（@michikodoll）、「Cozumel躺平的三天两夜」（@拿铁喝到打葛女士）、「我后悔没早点来这里…比马尔代夫还离谱的海」（@Bauerschwein）、「Cozumel |墨西哥科苏梅尔攻略与避雷」（@安迪家的杰西卡）、「墨西哥Cozumel岛宝藏全包酒店Explorean」（@不爱冒险的罗罗）；评分来自 Google 地图（2026 年 10–11 月）。"}];

/* 巴卡拉尔：单独的 3 天 2 晚攻略，从墨城飞切图马尔 */
GUIDE.bacalar.transport=[{h:"建议游玩路线：墨城 ✈ 切图马尔 → 巴卡拉尔，住 2 晚"},
  "map:bacalar",
  "leg:bf",
  "已经在图卢姆（Tulum）的话，也可以开车过来，Google 地图约 2.5 小时，玩完从切图马尔飞回墨城。",
  "leg:ag","leg:s",
  "[[link:https://www.google.com/maps/dir/Aeropuerto+Internacional+de+Chetumal/Bacalar,+Quintana+Roo|从切图马尔机场导航]]",
  {h:"到了以后"},
  "网友说镇上没有 Uber，出门靠出租车：酒店、民宿一般都有司机的电话，出发前打电话，10 分钟内就到；镇中心广场一侧也有出租车站。小镇不大，去各个景点十几分钟，最远的漂流也在 20 分钟以内。",
  "一定多带现金，很多地方不能刷卡；网友说三天都没看到便利店，零食和装备带齐。",
  {h:"注意"},
  "网友说旺季是 10–12 月，酒店基本是小型精品酒店，提前订。",
  "为了保护湖水，网友说不能涂防晒霜，要穿防晒衣；湖边蚊子多，带驱蚊水。",
  "有美国签证的话，网友说可以从切图马尔坐船去伯利兹（Belize），出发前核实。",
  {src:"来源：小红书笔记「墨城出发Bacalar 3天2晚攻略」（@糖月月）、「墨西哥bacalar攻略🌊🌊」（@Dino）、「🇲🇽蓝调秘境｜Bacalar泄湖攻略」（@甜椒肉丝）、「坐玛雅火车去体验下Bacalar的蓝绿色暖湖」（@索尼鸭🦆）、「🇲🇽爱上在Bacalar当野人的感觉(附攻略」（@無添加日记）、「Bacalar酒店体验 our habitas bacalar」（@松香小雪）；自驾时间和距离来自 Google 地图（2026 年 10–11 月）。"}];
GUIDE.bacalar.route=[{h:"3 天 2 晚的走法"},"route:bacalar",{h:"玩什么（网友推荐）"},YUC_W.bacalar,
  "网友说游湖坐帆船或低速的浮桥船最舒服，远离水上摩托；半天约 400–800 比索一人。有网友在 Airbnb 订了 3 小时帆船，也有网友报 Tours Wild Wave Bacalar 的帆船。",
  {src:"来源：小红书笔记「墨城出发Bacalar 3天2晚攻略」（@糖月月）、「🇲🇽爱上在Bacalar当野人的感觉(附攻略」（@無添加日记）、「墨西哥Bacalar比马尔代夫还chill」（@Jun的生活📝）、「在墨西哥发现“七色湖”比坎昆安静Bacalar」（@墨西哥红黑榜）、「墨西哥旅游🇲🇽Bacalar乘浮桥船游览七彩湖」（@兔兔丁）、「坐玛雅火车去体验下Bacalar的蓝绿色暖湖」（@索尼鸭🦆）、「🇲🇽蓝调秘境｜Bacalar泄湖攻略」（@甜椒肉丝）；评分来自 Google 地图（2026 年 10–11 月）。"}];
/* 普埃布拉、乔卢拉和瓦尔基里科在同一条路线上，共用「路线和交通」「行程安排」。 */
for(const id of ["puebla","cholula"]){GUIDE[id].transport=GUIDE.valquirico.transport;GUIDE[id].route=GUIDE.valquirico.route;}
/* Intros: summarized and translated by Claude from the official tourism pages and Wikipedia (Oct 2026). */
