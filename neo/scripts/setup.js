/**
 * Demo Data
 */
function Data() {
  return Process(
    "models.pet.Insert",
    ["name", "type", "status", "mode", "stay", "cost", "appearance", "images"],
    [
      [
        "Cookie",
        "cat",
        "checked",
        "enabled",
        "2023-05-15 00:00:00",
        105,
        [1],
        "https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/pet.jpg",
      ],
      [
        "Baby",
        "dog",
        "checked",
        "enabled",
        "2023-05-15 00:00:00",
        24,
        [2],
        "https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/dog.jpg",
      ],
      [
        "Poo",
        "others",
        "checked",
        "enabled",
        "2023-05-15 00:00:00",
        66,
        [3],
        "https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/pig.jpg",
      ],
    ]
  );
}
