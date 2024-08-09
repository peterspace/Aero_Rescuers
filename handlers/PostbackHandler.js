class PostbackHandler {
  constructor(webSocketServer) {
    this.webSocketServer = webSocketServer;
  }

  handle(req, res, type) {
    const {
      fbclid, // profile.id,
      external_id, // profile.id,
      campaign_name,
      campaign_id,
      visitor_code,
      user_agent,
      ip,
      offer,
      region,
      city,
    } = req.query;
    const userIp = ip; // Получаем IP-адрес пользователя из запроса

    if (!userIp) {
      res.status(400).send("IP address is required");
      return;
    }

    const data = {
      //   message: "purchase",
      message: type,
      af_content_id: fbclid,
      ip: ip,
    };

    // Отправка сообщения "purchase" только клиенту с указанным IP-адресом
    // this.webSocketServer.sendToClientByIp(userIp, { message: 'purchase' });
    this.webSocketServer.sendToClientByIp(userIp, data);

    res.status(200).send("Postback received");
  }
}

module.exports = PostbackHandler;
