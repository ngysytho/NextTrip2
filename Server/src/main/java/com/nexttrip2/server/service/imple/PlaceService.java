@Override
@PostConstruct
public void importPlaces() {
    System.out.println("✅ Bắt đầu chạy importPlaces...");

    ObjectMapper mapper = new ObjectMapper();
    try {
        InputStream is = getClass().getClassLoader().getResourceAsStream("test.json");
        if (is == null) {
            System.out.println("❌ Không tìm thấy file test.json trong resources");
            return;
        }
        JsonNode node = mapper.readTree(is);
        System.out.println("✅ Đã đọc file JSON thành công");

        for (JsonNode obj : node) {
            System.out.println("➡️ Importing: " + obj.path("title").asText());
            Place place = new Place();

            String placeId = obj.path("placeId").asText(null);
            if (placeId == null) {
                placeId = UUID.randomUUID().toString();
            }
            place.setPlace_id(placeId);

            place.setName_places(obj.path("title").asText());
            place.setAddress_places(obj.path("address").asText());
            place.setProvince_places(obj.path("state").asText(null));
            place.setPhone_number_places(obj.path("phone").asText(null));
            place.setWebsite_url_places(obj.path("website").asText(null));
            place.setImage_url_places(obj.path("imageUrl").asText(null));
            place.setType_places(obj.path("categoryName").asText(null));
            place.setRating_places((float) obj.path("totalScore").asDouble(0.0));

            // Parse open and close time
            if (obj.has("openingHours") && obj.get("openingHours").isArray() && obj.get("openingHours").size() > 0) {
                String hours = obj.get("openingHours").get(0).path("hours").asText("");
                String[] split = hours.split("to");
                if (split.length == 2) {
                    place.setOpen_time_places(split[0].trim());
                    place.setClose_time_places(split[1].trim());
                }
            }

            // Parse ticket price
            String price = obj.path("price").asText("");
            if (!price.isEmpty()) {
                price = price.replaceAll("[^\\d]", "");
                if (!price.isEmpty()) {
                    place.setTicket_price_places(Float.parseFloat(price));
                }
            }

            // Save if not exists
            if (!placeRepository.existsById(place.getPlace_id())) {
                placeRepository.save(place);
            }
        }

        System.out.println("✅ Import Places thành công!");
    } catch (Exception e) {
        e.printStackTrace();
    }
}
