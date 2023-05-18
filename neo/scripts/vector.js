/**
 * Search personal data in the vendor database
 */

function Match(context, messages) {
  console.log(context, messages);
  return [
    {
      role: "system",
      content: `{ "name":"架构的演化与软件的未来.pdf", summary:"行业软件: 面向特定行业人群，承载行业一组服务或帮助从业者快速或高质 量的完成工作任务的工具。", "type":"pdf", "url":"https://yaoapps.com"}`,
    },
    {
      role: "system",
      content: `{ "name":"YAO 官方文档 Part1 .pdf", summary:"使用 YAO 应用引擎，最快几分钟，从零构建一套系统。基于Golang，高性能、支持通过JS进行逻辑拓展，适用于AI、物联网、工业互联网、车联网、IT 运维、能源、金融等领域。", "type":"pdf", "url":"https://yaoapps.com"}`,
    },
    {
      role: "system",
      content: `{ "name":"YAO 官方文档 Part2 .pdf", summary:"YAO 根据业务特征，定义了一套 YAO DSL，用来描述数据结构、数据流、API 接口、并发任务、计划任务、Socket 服务等功能模块，这些功能模块被定义为 Widget。", "type":"pdf", "url":"https://yaoapps.com"}`,
    },
    {
      role: "system",
      content: `
        - The above content is my knowledge base.
        - Please prioritize answering user questions based on my knowledge base provided to you.
       `,
    },
  ];
}
