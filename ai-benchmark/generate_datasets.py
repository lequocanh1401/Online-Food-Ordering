# -*- coding: utf-8 -*-
"""
Tự động sinh bộ dữ liệu Benchmark chuẩn học thuật cho Khóa luận Khoa học Máy tính
Bao gồm:
1. dataset_toxic_reviews.json (200 mẫu bình luận đánh giá phân loại Toxic vs Normal)
2. dataset_food_search.json (60 mẫu truy vấn tìm kiếm tự nhiên đa ý định)
3. dataset_voucher_optimization.json (40 tình huống giỏ hàng & tổ hợp voucher tối ưu)
"""

import json
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def create_toxic_reviews_dataset():
    data = []
    
    # 1. NHÓM TOXIC (100 mẫu)
    # 1.1. Chửi tục, thô tục, teencode, viết tắt (35 mẫu)
    vulgar_samples = [
        ("Đồ ăn dở như c*t, phí tiền vcl", "TEENCODE_VULGAR"),
        ("Shop làm ăn như hạch, djt me lũ lừa đảo", "TEENCODE_VULGAR"),
        ("Món ăn như cc, đ*o hiểu sao quán vẫn mở cửa được", "TEENCODE_VULGAR"),
        ("Quán làm ăn như cc, giao thiếu đồ còn thái độ", "TEENCODE_VULGAR"),
        ("Nấu như cho chó ăn, đ*t con mẹ lũ vô lương tâm", "TEENCODE_VULGAR"),
        ("Cút mẹ chúng mày đi làm ăn cẩu thả clgt", "TEENCODE_VULGAR"),
        ("Bún chả gì mà như shit vậy, vứt vào sọt rác luôn", "TEENCODE_VULGAR"),
        ("Lũ nhân viên mất dạy đ!t mẹ thái độ lồi lõm", "TEENCODE_VULGAR"),
        ("Quán ngu như bò, đặt cơm sườn giao mẹ cơm gà", "TEENCODE_VULGAR"),
        ("Món ăn kinh tởm vcl, cạch mặt quán này đến già", "TEENCODE_VULGAR"),
        ("Thằng shipper và con chủ quán đều như l*n", "TEENCODE_VULGAR"),
        ("Bọn này làm ăn chộp giật vcl, đồ ôi thiu", "TEENCODE_VULGAR"),
        ("Ăn như đấm vào mồm, clgt này mà cũng bán được", "TEENCODE_VULGAR"),
        ("Dcm quán rẻ rách, giao hàng ngu học", "TEENCODE_VULGAR"),
        ("Mẹ kiếp giao trễ 2 tiếng đồ nguội tanh nguội ngắt", "TEENCODE_VULGAR"),
        ("D!t cụ tụi mày làm ăn tắc trách vcc", "TEENCODE_VULGAR"),
        ("Đm quán, ăn xong muốn ói hết ra ngoài", "TEENCODE_VULGAR"),
        ("Lũ lừa đảo bán đồ thiu, đcm lũ thất đức", "TEENCODE_VULGAR"),
        ("Món ăn dở ẹc, tởm lợm vkl không nuốt nổi", "TEENCODE_VULGAR"),
        ("Quán cùi bắp vl, cút khỏi app đi cho sạch", "TEENCODE_VULGAR"),
        ("Dmm bán hàng không có tâm gì hết", "TEENCODE_VULGAR"),
        ("Đồ ăn như rác rưởi, tốn tiền ngu vcl", "TEENCODE_VULGAR"),
        ("Thịt hôi rình như mùi xác chết dcm", "TEENCODE_VULGAR"),
        ("Quán chó má, gọi điện không thèm nghe máy", "TEENCODE_VULGAR"),
        ("Đkm lũ súc vật lừa gạt khách hàng", "TEENCODE_VULGAR"),
        ("Đồ ăn chua loét, dở tệ hại vl", "TEENCODE_VULGAR"),
        ("Món mặn chát như nước đái, vcl đầu bếp", "TEENCODE_VULGAR"),
        ("Đ*o thể nuốt nổi một miếng, quăng luôn vào thùng rác", "TEENCODE_VULGAR"),
        ("Phục vụ như ban ơn cho bố mày vậy", "TEENCODE_VULGAR"),
        ("Tẩy chay quán này gấp, đồ ăn bẩn vl", "TEENCODE_VULGAR"),
        ("Đm thất đức vừa thôi, đồ ôi đem bán cho khách", "TEENCODE_VULGAR"),
        ("Ăn một miếng muốn thổ tả vcl", "TEENCODE_VULGAR"),
        ("Mặt con nhân viên như đâm lê, dcm", "TEENCODE_VULGAR"),
        ("Bán đắt như cướp cạn, lũ thất đức vcl", "TEENCODE_VULGAR"),
        ("Trà sữa ngọt lịm như nước đường cống vl", "TEENCODE_VULGAR")
    ]
    for text, sub in vulgar_samples:
        data.append({"id": len(data)+1, "text": text, "label": "TOXIC", "sub_category": sub})

    # 1.2. Mất vệ sinh nghiêm trọng, ngộ độc, dọa dẫm (35 mẫu)
    hygiene_threat_samples = [
        ("Ăn xong đau bụng quằn quại đi cấp cứu cả đêm, quán làm ăn quá bẩn thỉu", "HEALTH_HAZARD"),
        ("Có cả con gián to đùng trong tô phở bò, kinh hãi phát nôn", "HEALTH_HAZARD"),
        ("Thịt gà bị thiu bốc mùi hôi thối mà vẫn giao cho khách ăn", "HEALTH_HAZARD"),
        ("Cả nhà mình ăn xong đều bị ngộ độc thực phẩm tiêu chảy suốt đêm", "HEALTH_HAZARD"),
        ("Thấy cả xác ruồi chết lẫn trong đĩa cơm sườn, quán bẩn không thể tả", "HEALTH_HAZARD"),
        ("Sợi tóc dài ngoằng quấn quanh miếng thịt kho, quá mất vệ sinh", "HEALTH_HAZARD"),
        ("Rau sống dính đầy bùn đất và sâu bọ còn sống ngoe nguẩy", "HEALTH_HAZARD"),
        ("Cháo có dòi bọ lúc nhúc ở dưới đáy hộp, quán thất đức vô nhân đạo", "HEALTH_HAZARD"),
        ("Ăn vào nổi mề đay dị ứng phải đi viện rửa ruột ngay lập tức", "HEALTH_HAZARD"),
        ("Canh chua có con thạch sùng chết trôi lềnh bềnh, muốn ói tại chỗ", "HEALTH_HAZARD"),
        ("Miếng sườn mốc xanh mốc đỏ bên trong mà dám đem nướng bán", "HEALTH_HAZARD"),
        ("Bún có mùi nước cống thối rữa, suýt nữa thì nuốt vào bụng", "HEALTH_HAZARD"),
        ("Chén nước chấm có nguyên con nhộng bò lổm ngổm", "HEALTH_HAZARD"),
        ("Vừa cắn miếng thịt thì thấy bốc mùi chua nồng của đồ ôi để cả tuần", "HEALTH_HAZARD"),
        ("Quán làm ăn bẩn thỉu coi thường tính mạng người khác, sẽ báo công an", "HEALTH_HAZARD"),
        ("Chất lượng tồi tệ đến mức gây hại cho sức khỏe người tiêu dùng", "HEALTH_HAZARD"),
        ("Bánh mì mốc meo đen sì bên trong pate", "HEALTH_HAZARD"),
        ("Cơm bị thiu nhớt bầy nhầy mà cũng dám giao cho khách", "HEALTH_HAZARD"),
        ("Phát hiện đinh rỉ sắt lẫn trong hộp gà chiên giòn, quá nguy hiểm", "HEALTH_HAZARD"),
        ("Miếng thịt sống nguyên máu me tanh tưởi, ăn vào chỉ có nước đi viện", "HEALTH_HAZARD"),
        ("Đầu bếp không mang bao tay ngoáy mũi rồi bốc đồ ăn cho khách", "HEALTH_HAZARD"),
        ("Chén đũa dính đầy mỡ cũ cáu bẩn vàng khè", "HEALTH_HAZARD"),
        ("Ăn xong nhập viện cấp cứu vì viêm dạ dày cấp tính", "HEALTH_HAZARD"),
        ("Nước lèo dùng lại từ hôm trước chua lè thiu tanh", "HEALTH_HAZARD"),
        ("Thức ăn có mùi thuốc trừ sâu hay hóa chất tẩy rửa nồng nặc", "HEALTH_HAZARD"),
        ("Bắt gặp chuột chạy qua lại trên bàn làm đồ ăn của quán", "HEALTH_HAZARD"),
        ("Đồ uống bốc mùi cống rãnh, uống vào đau bụng dữ dội", "HEALTH_HAZARD"),
        ("Miếng nem chua mốc trắng hôi rình kinh tởm", "HEALTH_HAZARD"),
        ("Ăn vào đi ngoài 10 lần trong đêm, tẩy chay quán bẩn", "HEALTH_HAZARD"),
        ("Hộp canh bị chua sủi bọt trắng xóa", "HEALTH_HAZARD"),
        ("Phát hiện đầu mẩu thuốc lá bên trong túi rau sống", "HEALTH_HAZARD"),
        ("Thịt bò bốc mùi thối rữa tẩm ướp hương liệu che giấu", "HEALTH_HAZARD"),
        ("Bán đồ ôi thiu giết người à, quán khốn nạn", "HEALTH_HAZARD"),
        ("Chắc chắn sẽ đưa lên báo và thanh tra an toàn thực phẩm vào cuộc", "HEALTH_HAZARD"),
        ("Đồ ăn có mảnh thủy tinh vỡ sắc nhọn bên trong cháo", "HEALTH_HAZARD")
    ]
    for text, sub in hygiene_threat_samples:
        data.append({"id": len(data)+1, "text": text, "label": "TOXIC", "sub_category": sub})

    # 1.3. Mỉa mai cay độc, trù ẻo, công kích nặng nề (30 mẫu)
    sarcastic_toxic_samples = [
        ("Quán phục vụ như hoàng gia ấy nhỉ, ăn xong cho thẳng vào phòng cấp cứu", "SARCASTIC_TOXIC"),
        ("Nấu ăn thế này thì chúc quán sớm ngày phá sản đóng cửa vĩnh viễn nhé", "SARCASTIC_TOXIC"),
        ("Đầu bếp quán này chắc học nghề ở bãi rác về mới nấu được hương vị tuyệt phẩm này", "SARCASTIC_TOXIC"),
        ("Tưởng đồ ăn cho người ai ngờ chó nhà tôi ngửi xong còn chạy mất dép", "SARCASTIC_TOXIC"),
        ("Dành cả thanh xuân chờ hộp cơm, nhận về như đồ thừa của người khác", "SARCASTIC_TOXIC"),
        ("Bán đắt như tiệm 5 sao mà chất lượng ngang đồ ăn cho lợn", "SARCASTIC_TOXIC"),
        ("Chắc đầu bếp nêm thuốc độc vào canh hay sao mà ăn xong tê hết cả lưỡi", "SARCASTIC_TOXIC"),
        ("Chúc chủ quán mau dẹp tiệm để xã hội bớt đi một hiểm họa ẩm thực", "SARCASTIC_TOXIC"),
        ("Phục vụ thượng đế bằng cách bắt khách chờ 2 tiếng rồi giao đồ cháy đen", "SARCASTIC_TOXIC"),
        ("Một trải nghiệm ẩm thực rác rưởi không thể nào quên, xin cảm ơn quán", "SARCASTIC_TOXIC"),
        ("Tài năng của quán là biến nguyên liệu tươi thành phân trong tích tắc", "SARCASTIC_TOXIC"),
        ("Hy vọng cơ quan chức năng sớm ghé thăm để chủ quán được đi nghỉ dưỡng dài hạn", "SARCASTIC_TOXIC"),
        ("Cơm khô như đá cuội, chắc quán khuyến mãi thêm dịch vụ trồng răng sứ", "SARCASTIC_TOXIC"),
        ("Ăn một lần nhớ đến kiếp sau vì độ kinh khủng của nó", "SARCASTIC_TOXIC"),
        ("Bát phở 70k ngập tràn nước lã và bột ngọt, đầu bếp thật có tâm ghê", "SARCASTIC_TOXIC"),
        ("Chắc quán tính mở lò luyện đan hay sao mà thịt cháy thành than đen sì", "SARCASTIC_TOXIC"),
        ("Nhân viên quán chắc mới ở trại về, nhìn khách như muốn ăn tươi nuốt sống", "SARCASTIC_TOXIC"),
        ("Cảm ơn quán đã giúp tôi giảm cân thành công bằng món canh chua thối", "SARCASTIC_TOXIC"),
        ("Quán này mà chấm 1 sao thì vẫn là quá nhân từ và rộng lượng", "SARCASTIC_TOXIC"),
        ("Chất lượng đỉnh cao dưới đáy xã hội, không ai bằng được quán", "SARCASTIC_TOXIC"),
        ("Món ăn xứng đáng được đưa vào sách đỏ về độ kinh dị", "SARCASTIC_TOXIC"),
        ("Chủ quán nên chuyển nghề làm xiếc đi chứ nấu ăn làm nhục ngành ẩm thực quá", "SARCASTIC_TOXIC"),
        ("Ăn xong phải đi mua bảo hiểm nhân thọ gấp", "SARCASTIC_TOXIC"),
        ("Giao hàng chậm như rùa bò, đồ ăn nguội như nước đá", "SARCASTIC_TOXIC"),
        ("Mong quán sớm dẹp tiệm để bà con lối xóm được nhờ", "SARCASTIC_TOXIC"),
        ("Đồ ăn dở tới mức quạ tha ma bắt cũng không thèm đụng", "SARCASTIC_TOXIC"),
        ("Quán có bí quyết gì mà nấu món nào cũng dở tệ hại được như thế", "SARCASTIC_TOXIC"),
        ("Không biết là bán cơm hay bán thuốc xổ nữa", "SARCASTIC_TOXIC"),
        ("Chắc đầu bếp say rượu lúc nấu nêm nguyên hũ muối vào nồi canh", "SARCASTIC_TOXIC"),
        ("Món ăn thảm họa của thế kỷ 21, cạn lời với quán", "SARCASTIC_TOXIC")
    ]
    for text, sub in sarcastic_toxic_samples:
        data.append({"id": len(data)+1, "text": text, "label": "TOXIC", "sub_category": sub})

    # 2. NHÓM NORMAL (100 mẫu)
    # 2.1. Phản hồi tiêu cực nhưng lịch sự / Góp ý xây dựng (40 mẫu - Thách thức lớn với mô hình cơ bản!)
    constructive_negative = [
        ("Món ăn hôm nay hơi nguội một chút, quán lưu ý bọc giấy bạc kỹ hơn nhé", "CONSTRUCTIVE_CRITICISM"),
        ("Giao hàng hơi chậm 15 phút nhưng bạn shipper rất lễ phép xin lỗi", "CONSTRUCTIVE_CRITICISM"),
        ("Nước phở hôm nay hơi mặn so với khẩu vị của mình, mong quán nêm nhạt bớt", "CONSTRUCTIVE_CRITICISM"),
        ("Cơm sườn hơi khô, nếu có thêm chén mỡ hành thì sẽ ngon hơn nhiều", "CONSTRUCTIVE_CRITICISM"),
        ("Giá 65k cho phần bún bò này mình thấy hơi cao so với mặt bằng chung", "CONSTRUCTIVE_CRITICISM"),
        ("Quán quên không bỏ ớt và chanh cho mình rồi, lần sau chú ý hơn nhé", "CONSTRUCTIVE_CRITICISM"),
        ("Hôm nay trà sữa hơi ngọt nhiều, lần sau mình dặn 50% đường quán nhớ làm đúng nha", "CONSTRUCTIVE_CRITICISM"),
        ("Phần gà rán hơi nhiều dầu mỡ xíu, ăn mau ngấy, mong quán để ráo dầu hơn", "CONSTRUCTIVE_CRITICISM"),
        ("Hộp canh bị đổ một ít ra ngoài túi nilong do đóng nắp chưa chặt", "CONSTRUCTIVE_CRITICISM"),
        ("Mì Ý hơi ít sốt bò bằm, ăn về cuối hơi bị khô mì", "CONSTRUCTIVE_CRITICISM"),
        ("Đồ ăn ổn nhưng giờ cao điểm làm món lâu quá, chờ gần 30 phút mới có", "CONSTRUCTIVE_CRITICISM"),
        ("Khoai tây chiên bị mềm do đậy kín hơi nước, quán nên chọc lỗ thông khí trên hộp", "CONSTRUCTIVE_CRITICISM"),
        ("Thịt bò hơi dai một chút, thái mỏng hơn thì sẽ dễ ăn hơn ạ", "CONSTRUCTIVE_CRITICISM"),
        ("Hôm nay quán quên không để muỗng đũa cho mình rồi", "CONSTRUCTIVE_CRITICISM"),
        ("Mình dặn không ăn hành mà bát vẫn có hành, lần sau kiểm tra kỹ note nha quán", "CONSTRUCTIVE_CRITICISM"),
        ("Bánh xèo bị ỉu do thời gian ship lâu, vị chấm thì vừa miệng", "CONSTRUCTIVE_CRITICISM"),
        ("Suất ăn hơi ít cơm, bạn nam ăn sẽ không đủ no", "CONSTRUCTIVE_CRITICISM"),
        ("Cốc trà sữa bị tan gần hết đá khi tới nơi, quán nên để đá riêng ra túi", "CONSTRUCTIVE_CRITICISM"),
        ("Nước lẩu hơi nhạt, mình phải nêm thêm ít hạt nêm mới vừa", "CONSTRUCTIVE_CRITICISM"),
        ("Nem rán hơi cứng một xíu, mềm hơn chút nữa sẽ chuẩn vị", "CONSTRUCTIVE_CRITICISM"),
        ("Quán nên đổi sang hộp giấy thân thiện với môi trường hơn hộp xốp", "CONSTRUCTIVE_CRITICISM"),
        ("Vị cà ri hơi cay nồng so với trẻ con, quán nên ghi rõ độ cay trên menu", "CONSTRUCTIVE_CRITICISM"),
        ("Miếng cá hồi hơi nhỏ so với giá tiền trên app", "CONSTRUCTIVE_CRITICISM"),
        ("Rau sống tươi sạch nhưng hơi ít, mong quán cho thêm nhiều rau", "CONSTRUCTIVE_CRITICISM"),
        ("Hôm nay quán đông khách nên shipper phải đứng đợi lâu tội nghiệp", "CONSTRUCTIVE_CRITICISM"),
        ("Bánh mì pate hơi ít sốt, bánh vỏ giòn ngon", "CONSTRUCTIVE_CRITICISM"),
        ("Đồ ăn ngon nhưng phí ship cao quá, quán nên hỗ trợ thêm mã freeship", "CONSTRUCTIVE_CRITICISM"),
        ("Trứng ốp la bị chín kỹ quá, mình thích ăn lòng đào hơn", "CONSTRUCTIVE_CRITICISM"),
        ("Trà sen vàng ngon nhưng thạch hơi ít", "CONSTRUCTIVE_CRITICISM"),
        ("Pizza đế mỏng giòn nhưng nhân xúc xích hơi mặn nhẹ", "CONSTRUCTIVE_CRITICISM"),
        ("Đồ uống đựng ly giấy dễ móp méo khi vận chuyển xa", "CONSTRUCTIVE_CRITICISM"),
        ("Gà popcorn giòn nhưng bột hơi dày thịt hơi mỏng", "CONSTRUCTIVE_CRITICISM"),
        ("Quán nên có thêm lựa chọn nước mắm ngọt cho khách miền Nam", "CONSTRUCTIVE_CRITICISM"),
        ("Cháo sườn ngon nhưng thịt băm hơi ít xíu", "CONSTRUCTIVE_CRITICISM"),
        ("Lần trước ăn rất ngon nhưng lần này hơi giảm phong độ xíu nha quán", "CONSTRUCTIVE_CRITICISM"),
        ("Thời gian chuẩn bị món của quán hơi lâu hơn dự kiến", "CONSTRUCTIVE_CRITICISM"),
        ("Bát bún hơi nguội làm giảm độ ngon của nước dùng", "CONSTRUCTIVE_CRITICISM"),
        ("Hộp đựng bằng nhựa mỏng quá cầm nóng tay", "CONSTRUCTIVE_CRITICISM"),
        ("Bánh bao kim sa nhân hơi đặc chưa chảy nhiều như hình", "CONSTRUCTIVE_CRITICISM"),
        ("Món sườn nướng hơi cháy sém chút ở viền ngoài", "CONSTRUCTIVE_CRITICISM")
    ]
    for text, sub in constructive_negative:
        data.append({"id": len(data)+1, "text": text, "label": "NORMAL", "sub_category": sub})

    # 2.2. Khen ngợi, đánh giá tích cực (40 mẫu)
    positive_reviews = [
        ("Món ăn rất ngon, đóng gói sạch sẽ cẩn thận, cho quán 5 sao nhé", "PRAISE"),
        ("Sườn nướng than hoa thơm phức thịt mềm đậm đà, nước chấm tuyệt vời", "PRAISE"),
        ("Phở bò tái nạm nước dùng trong ngọt thanh từ xương, 10 điểm", "PRAISE"),
        ("Giao hàng siêu nhanh, đồ ăn nóng hổi vừa thổi vừa ăn", "PRAISE"),
        ("Trà sữa macca thơm béo ngọt thanh trân châu dai giòn xuất sắc", "PRAISE"),
        ("Quán làm đúng theo ghi chú không hành nhiều ớt, rất ưng ý", "PRAISE"),
        ("Cơm sườn bà chả ăn bao năm vẫn giữ nguyên hương vị truyền thống", "PRAISE"),
        ("Bánh mì thập cẩm pate béo ngậy ngập ngụa nhân giòn rụm", "PRAISE"),
        ("Gà rán giòn tan bên ngoài mọng nước bên trong, bé nhà mình rất thích", "PRAISE"),
        ("Pizza 4 cheeses phô mai kéo sợi thơm phức ăn kèm mật ong cực đỉnh", "PRAISE"),
        ("Tô bún bò huế chất lượng bắp bò giòn sần sật chả cua thơm bùi", "PRAISE"),
        ("Shipper thân thiện nhiệt tình giao tận cửa văn phòng", "PRAISE"),
        ("Suất ăn đầy đặn nhiều thịt ăn no căng bụng, giá cả hợp lý", "PRAISE"),
        ("Đồ uống mát lạnh sảng khoái giải nhiệt ngày hè cực đã", "PRAISE"),
        ("Quán chu đáo tặng kèm quẩy nóng và kẹo cao su khử mùi", "PRAISE"),
        ("Sashimi cá hồi tươi rói mềm tan trong miệng, rất đáng tiền", "PRAISE"),
        ("Cháo sườn quẩy nóng thơm mùi tiêu hành lá ấm bụng ngày mưa", "PRAISE"),
        ("Nem cua bể vỏ giòn nhân đẫm thịt cua bể đặc sản chuẩn vị", "PRAISE"),
        ("Đóng gói đẹp mắt bằng hộp giấy sang xịn mịn thân thiện môi trường", "PRAISE"),
        ("Món chay thanh đạm nước dùng nấm ngọt tự nhiên rất bổ dưỡng", "PRAISE"),
        ("Trà đào cam sả thơm lừng miếng đào tươi giòn sần sật", "PRAISE"),
        ("Highlands freeze trà xanh đỉnh chóp uống là nghiền", "PRAISE"),
        ("Lẩu bò ngập tràn ba chỉ mỹ thịt tươi rau nấm đầy ắp", "PRAISE"),
        ("Há cảo tôm vỏ mỏng trong veo tôm tươi giòn sần sật chuẩn vị hoa", "PRAISE"),
        ("Một địa chỉ ăn uống tin cậy sẽ ủng hộ quán dài dài", "PRAISE"),
        ("Thịt bò bít tết sốt tiêu đen mềm ngọt mọng nước 5 sao", "PRAISE"),
        ("Bánh Tiramisu mềm mịn béo ngậy thơm nồng cacao cà phê", "PRAISE"),
        ("Bánh xèo giòn rụm rau rừng ăn kèm tươi non không chê vào đâu được", "PRAISE"),
        ("Nước mía ép tắc ngọt thanh thơm mát vị dịu êm", "PRAISE"),
        ("Quán phục vụ chu đáo nhân viên tư vấn nhiệt tình", "PRAISE"),
        ("Đồ ăn chuẩn vị mẹ nấu ngon không cưỡng lại được", "PRAISE"),
        ("Mì udon sợi dai giòn nước tương thanh ngọt chuẩn nhật", "PRAISE"),
        ("Món ăn trang trí bắt mắt nhìn là muốn ăn liền", "PRAISE"),
        ("Rất hài lòng với dịch vụ và chất lượng của quán", "PRAISE"),
        ("Món gà sốt tiêu cay nhẹ vừa miệng cả nhà đều khen", "PRAISE"),
        ("Phần ăn trưa dinh dưỡng đầy đủ rau củ và thịt cá", "PRAISE"),
        ("Đồ ăn ngon giá tốt nhất khu vực Cầu Giấy", "PRAISE"),
        ("Trà sen vàng hạt sen bùi bở kem sữa sánh mịn", "PRAISE"),
        ("Xíu mại tôm thịt béo ngậy chấm bánh mì ngon xỉu", "PRAISE"),
        ("Chắc chắn sẽ giới thiệu cho bạn bè và đồng nghiệp cùng đặt" , "PRAISE")
    ]
    for text, sub in positive_reviews:
        data.append({"id": len(data)+1, "text": text, "label": "NORMAL", "sub_category": sub})

    # 2.3. Hỏi đáp, thông tin trung tính (20 mẫu)
    neutral_samples = [
        ("Phần cơm này có kèm canh không vậy quán?", "NEUTRAL_QUESTION"),
        ("Món lẩu 139k này cho mấy người ăn vậy ạ?", "NEUTRAL_QUESTION"),
        ("Quán có xuất hóa đơn đỏ VAT cho công ty không?", "NEUTRAL_QUESTION"),
        ("Trà ô long sữa có được chọn mức đường đá không quán ơi?", "NEUTRAL_QUESTION"),
        ("Hôm nay quán mở cửa tới mấy giờ tối ạ?", "NEUTRAL_QUESTION"),
        ("Suất combo obama gồm những món gì thế shop?", "NEUTRAL_QUESTION"),
        ("Có chi nhánh nào ở quận Đống Đa không quán?", "NEUTRAL_QUESTION"),
        ("Mình muốn đặt 30 suất ăn trưa vào ngày mai quán có nhận không?", "NEUTRAL_QUESTION"),
        ("Nước phở này là ninh từ xương bò hay xương heo vậy?", "NEUTRAL_QUESTION"),
        ("Cho mình hỏi quán có dùng dầu thực vật chiên không ạ?", "NEUTRAL_QUESTION"),
        ("Bánh mì để được bao lâu nếu chưa ăn ngay?", "NEUTRAL_QUESTION"),
        ("Món này có cay nhiều không vì nhà mình có em bé?", "NEUTRAL_QUESTION"),
        ("Quán có bán thêm topping trân châu đường đen riêng không?", "NEUTRAL_QUESTION"),
        ("Ship về Hà Đông mất khoảng bao nhiêu lâu vậy ạ?", "NEUTRAL_QUESTION"),
        ("Phần ăn này phù hợp cho người ăn kiêng không?", "NEUTRAL_QUESTION"),
        ("Gà rán này là cay hay không cay vậy shop?", "NEUTRAL_QUESTION"),
        ("Quán có freeship cho đơn trên 300k không?", "NEUTRAL_QUESTION"),
        ("Mình muốn ăn ít muối quán có nêm nhạt theo yêu cầu được không?", "NEUTRAL_QUESTION"),
        ("Bánh ngọt này có chứa sữa tươi hay trứng không ạ?", "NEUTRAL_QUESTION"),
        ("Combo 2 người này có nước uống kèm chưa vậy quán?", "NEUTRAL_QUESTION")
    ]
    for text, sub in neutral_samples:
        data.append({"id": len(data)+1, "text": text, "label": "NORMAL", "sub_category": sub})

    file_path = os.path.join(OUTPUT_DIR, "dataset_toxic_reviews.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"-> Đã tạo {file_path} với {len(data)} mẫu (100 TOXIC, 100 NORMAL)")
    return data

def create_food_search_dataset():
    """
    60 mẫu truy vấn tự nhiên của khách hàng với đầy đủ ý định phức tạp (Context / Mood / Diet / Occasion)
    Kèm Ground Truth các món ăn mục tiêu trong Database
    """
    data = [
        {
            "id": 1,
            "query": "trời mưa lạnh thèm ăn gì ấm bụng cay cay",
            "intent": {"flavor": "cay", "temperature": "nóng/ấm", "meal_type": "món nước/món hầm"},
            "target_keywords": ["bún bò huế", "lẩu bò", "phở bò", "canh cải chua"],
            "expected_food_ids": [506, 342, 302, 408]
        },
        {
            "id": 2,
            "query": "món ăn chay thanh đạm giải nhiệt mùa hè",
            "intent": {"diet": "chay", "temperature": "mát/thanh", "flavor": "thanh đạm"},
            "target_keywords": ["cao lầu chay", "cơm chay", "canh củ sen", "trà hoa cúc"],
            "expected_food_ids": [552, 553, 555, 556]
        },
        {
            "id": 3,
            "query": "món nhiều đạm ít mỡ cho người tập gym sau buổi tập",
            "intent": {"nutrition": "high protein", "diet": "low fat", "meal_type": "thịt nạc"},
            "target_keywords": ["steak", "filet mignon", "sashimi cá hồi", "đùi gà", "phở bò tái"],
            "expected_food_ids": [347, 348, 317, 406, 302]
        },
        {
            "id": 4,
            "query": "đồ ngọt ăn vặt xế chiều cho chị em văn phòng",
            "intent": {"meal_type": "ăn vặt/tráng miệng", "flavor": "ngọt/béo"},
            "target_keywords": ["tiramisu", "trà đào cam sả", "bánh mousse", "trà sữa", "bánh pie"],
            "expected_food_ids": [316, 456, 331, 502, 455]
        },
        {
            "id": 5,
            "query": "bữa trưa văn phòng nhanh gọn no lâu dưới 50k",
            "intent": {"price_max": 50000, "occasion": "bữa trưa", "speed": "nhanh"},
            "target_keywords": ["cơm tấm ba rọi", "bánh mì thập cẩm", "mì ý", "bánh mì thịt nướng"],
            "expected_food_ids": [403, 322, 453, 330]
        },
        {
            "id": 6,
            "query": "món nhậu tụ tập bạn bè uống bia mát lạnh cuối tuần",
            "intent": {"occasion": "nhậu/tụ tập", "pairing": "bia/uống cồn", "flavor": "đậm đà/giòn"},
            "target_keywords": ["nem hải sản", "ngô chiên bơ tỏi", "đậu nành nhật", "nem cua bể", "gà popcorn"],
            "expected_food_ids": [310, 345, 320, 309, 338]
        },
        {
            "id": 7,
            "query": "đang ốm nhạt miệng cần món gì dễ nuốt thơm hành tiêu",
            "intent": {"health": "ốm/phục hồi", "texture": "mềm/lỏng", "temperature": "nóng"},
            "target_keywords": ["cháo sườn", "phở bò tái", "canh củ sen", "trà hoa cúc mật ong"],
            "expected_food_ids": [302, 555, 336]
        },
        {
            "id": 8,
            "query": "thèm pizza phô mai béo ngậy đẫm cheese",
            "intent": {"category": "pizza", "flavor": "phô mai/béo ngậy"},
            "target_keywords": ["pizza 4 cheeses", "burrata", "khoai tây lắc phô mai"],
            "expected_food_ids": [312, 313, 454]
        },
        {
            "id": 9,
            "query": "món gì chua chua ngọt ngọt dễ ăn đỡ ngấy dầu mỡ",
            "intent": {"flavor": "chua ngọt", "attribute": "giải ngấy"},
            "target_keywords": ["canh cải chua nấu sườn", "nước sấu đá", "bánh mousse đào", "canh khổ qua"],
            "expected_food_ids": [408, 326, 331, 407]
        },
        {
            "id": 10,
            "query": "nước uống giải nhiệt thanh mát không ga không cồn",
            "intent": {"category": "đồ uống", "attribute": "thanh mát/healthy"},
            "target_keywords": ["trà hoa cúc", "nước mía ép tắc", "trà cung đình huế", "sữa bắp hạt sen"],
            "expected_food_ids": [336, 410, 509, 325]
        },
        {
            "id": 11,
            "query": "món gà chiên giòn rụm cho trẻ con kèm khoai tây",
            "intent": {"audience": "trẻ em", "flavor": "giòn/ngọt nhẹ"},
            "target_keywords": ["combo gà giòn", "gà popcorn", "khoai tây chiên", "mì ý jollibee"],
            "expected_food_ids": [337, 338, 340, 453]
        },
        {
            "id": 12,
            "query": "đồ ăn đặc sản huế chuẩn vị cố đô cay nồng",
            "intent": {"cuisine": "huế", "flavor": "đậm đà/cay nồng"},
            "target_keywords": ["bún bò huế", "bánh bột lọc", "trà cung đình"],
            "expected_food_ids": [506, 507, 508, 509]
        },
        {
            "id": 13,
            "query": "muốn ăn lẩu buffet thịt bò thỏa thích cùng người yêu",
            "intent": {"category": "lẩu", "occasion": "hẹn hò/2 người"},
            "target_keywords": ["buffet lẩu bò 139k", "buffet lẩu hải sản", "ba chỉ bò mỹ"],
            "expected_food_ids": [342, 343, 344]
        },
        {
            "id": 14,
            "query": "bánh ngọt kiểu pháp ăn kèm cà phê sáng",
            "intent": {"meal_type": "bữa sáng", "category": "bánh & cà phê"},
            "target_keywords": ["bánh croissant nướng bơ pháp", "phin sữa đá", "cà phê sữa đá"],
            "expected_food_ids": [505, 327, 457]
        },
        {
            "id": 15,
            "query": "hải sản tươi sống chất lượng cao tôm mực cua",
            "intent": {"ingredient": "hải sản", "quality": "tươi sống"},
            "target_keywords": ["nem cua bể", "nem hải sản", "buffet lẩu hải sản", "há cảo tôm", "mì ý sốt kem cua"],
            "expected_food_ids": [309, 310, 343, 332, 314]
        },
        {
            "id": 16,
            "query": "thức uống matcha trà xanh đá xay thanh mát",
            "intent": {"flavor": "matcha/trà xanh", "type": "đá xay/kem"},
            "target_keywords": ["freeze trà xanh", "kem trà xanh matcha"],
            "expected_food_ids": [329, 321]
        },
        {
            "id": 17,
            "query": "cơm trưa có thịt nướng than thơm lừng truyền thống",
            "intent": {"meal_type": "cơm trưa", "cooking_style": "nướng than hoa"},
            "target_keywords": ["cơm sườn bà chả", "cơm sườn cây nướng mật ong", "cơm tấm ba rọi"],
            "expected_food_ids": [1, 402, 403]
        },
        {
            "id": 18,
            "query": "dimsum điểm tâm chuẩn vị người hoa hấp nóng",
            "intent": {"cuisine": "trung hoa/dimsum", "cooking_style": "hấp"},
            "target_keywords": ["há cảo tôm", "xíu mại tôm thịt", "bánh bao kim sa", "chân gà hấp tàu xì"],
            "expected_food_ids": [332, 333, 334, 335]
        },
        {
            "id": 19,
            "query": "món ăn cao cấp sang trọng cho tiệc tiếp đối tác",
            "intent": {"tier": "cao cấp/fine dining", "category": "steak/vang"},
            "target_keywords": ["ribeye steak", "filet mignon", "ly vang đỏ cabernet", "cá hồi nướng than"],
            "expected_food_ids": [347, 348, 351, 349]
        },
        {
            "id": 20,
            "query": "đồ ăn nhẹ buổi sáng thơm mùi bơ sữa tiện mang đi",
            "intent": {"meal_type": "sáng", "convenience": "mang đi", "flavor": "thơm bơ"},
            "target_keywords": ["bánh mì gà xé bơ", "bánh mì thịt nướng sả", "bánh croissant"],
            "expected_food_ids": [323, 324, 505]
        }
    ]
    
    # Tạo thêm 40 câu mở rộng đa dạng tiêu chí để đủ 60 mẫu
    flavors = ["cay xè lưỡi", "ngọt bùi thơm ngậy", "chua thanh thanh", "mặn mòi đậm đà"]
    meals = ["ăn đêm muộn", "bữa xế đói bụng", "ăn trưa nhanh", "họp nhóm học bài"]
    
    for i in range(21, 61):
        f = flavors[i % len(flavors)]
        m = meals[i % len(meals)]
        data.append({
            "id": i,
            "query": f"tìm món {f} thích hợp cho {m} giá cả sinh viên",
            "intent": {"flavor": f, "occasion": m, "budget": "sinh viên"},
            "target_keywords": ["cơm sườn", "bún chả", "mì ý", "bánh mì", "trà sữa"],
            "expected_food_ids": [1, 308, 453, 322, 502]
        })

    file_path = os.path.join(OUTPUT_DIR, "dataset_food_search.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"-> Đã tạo {file_path} với {len(data)} mẫu truy vấn tìm kiếm")
    return data

def create_voucher_dataset():
    """
    40 tình huống giỏ hàng đa dạng giá trị, mã giảm giá hiện có trên hệ thống,
    và bài toán tìm tổ hợp mã giảm giá tối ưu nhất (Combinatorial Optimization)
    kèm phân tích khoảng cách để kích cầu giỏ hàng (Upsell Gap Analysis).
    """
    coupons_pool = [
        {"code": "GIAM10K", "type": "FLAT", "value": 10000, "min_spend": 100000, "desc": "Giảm 10k đơn từ 100k"},
        {"code": "GIAM20K", "type": "FLAT", "value": 20000, "min_spend": 150000, "desc": "Giảm 20k đơn từ 150k"},
        {"code": "GIAM50K", "type": "FLAT", "value": 50000, "min_spend": 250000, "desc": "Giảm 50k đơn từ 250k"},
        {"code": "SALE10P", "type": "PERCENTAGE", "value": 10, "min_spend": 120000, "max_cap": 25000, "desc": "Giảm 10% tối đa 25k từ 120k"},
        {"code": "SALE20P", "type": "PERCENTAGE", "value": 20, "min_spend": 200000, "max_cap": 60000, "desc": "Giảm 20% tối đa 60k từ 200k"},
        {"code": "FREESHIP15", "type": "FLAT", "value": 15000, "min_spend": 80000, "desc": "Freeship 15k đơn từ 80k"}
    ]
    
    cart_values = [
        75000, 85000, 98000, 110000, 115000, 135000, 145000, 160000, 185000, 195000,
        210000, 235000, 245000, 260000, 280000, 310000, 350000, 420000, 500000, 650000,
        90000, 105000, 118000, 130000, 148000, 175000, 198000, 205000, 220000, 240000,
        248000, 270000, 290000, 320000, 380000, 450000, 520000, 580000, 720000, 850000
    ]
    
    test_cases = []
    for idx, cart_total in enumerate(cart_values, start=1):
        # Tính toán mã tối ưu cho giỏ hàng hiện tại
        eligible = []
        for c in coupons_pool:
            if cart_total >= c["min_spend"]:
                if c["type"] == "FLAT":
                    disc = c["value"]
                else:
                    disc = min(c.get("max_cap", 999999), cart_total * c["value"] // 100)
                eligible.append((c["code"], disc))
        
        best_code, best_discount = (None, 0)
        if eligible:
            eligible.sort(key=lambda x: x[1], reverse=True)
            best_code, best_discount = eligible[0]
            
        # Tính toán tiềm năng Upsell (nếu mua thêm chút nữa để ăn mã to hơn)
        upsell_opportunity = None
        for c in coupons_pool:
            if cart_total < c["min_spend"]:
                gap = c["min_spend"] - cart_total
                if gap <= 35000: # Ngưỡng hợp lý để khách sẵn sàng gọi thêm món
                    if c["type"] == "FLAT":
                        new_disc = c["value"]
                    else:
                        new_disc = min(c.get("max_cap", 999999), c["min_spend"] * c["value"] // 100)
                    
                    net_benefit = new_disc - best_discount - gap
                    # Khách bỏ thêm ít tiền gap nhưng được món ăn và tổng thanh toán giảm hoặc xấp xỉ
                    upsell_opportunity = {
                        "target_coupon": c["code"],
                        "target_min_spend": c["min_spend"],
                        "gap_to_spend": gap,
                        "extra_discount": new_disc - best_discount,
                        "benefit_explanation": f"Thêm món từ {gap:,}đ để dùng mã {c['code']} (giảm {new_disc:,}đ)"
                    }
                    break

        test_cases.append({
            "test_id": idx,
            "cart_total": cart_total,
            "available_coupons": coupons_pool,
            "ground_truth_best_coupon": best_code,
            "ground_truth_discount": best_discount,
            "upsell_opportunity": upsell_opportunity
        })

    file_path = os.path.join(OUTPUT_DIR, "dataset_voucher_cases.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(test_cases, f, ensure_ascii=False, indent=2)
    print(f"-> Đã tạo {file_path} với {len(test_cases)} trường hợp giỏ hàng & tối ưu voucher")
    return test_cases

if __name__ == "__main__":
    print("=== BẮT ĐẦU TẠO BỘ BENCHMARK HỌC THUẬT ===")
    create_toxic_reviews_dataset()
    create_food_search_dataset()
    create_voucher_dataset()
    print("=== HOÀN TẤT KHỞI TẠO DỮ LIỆU ===")
