<!-- kafka-try-with-nodejs.microservices -->
<!-- Kafkanın mikro servis yapısındaki testi/simülesi. (Docker-Kafka-NodeJS) -->

# KAFKA ile MİKROSERVİS İLETİŞİMİ (TEMSİLİ)

Bu çalışmada, Kafka kullanımı test edilmiştir. Mikroservislerin nasıl kullanıldığı küçük ölçekte simüle edilmiştir. 
- SMS servisi, E-posta servisi gibi servislerde geri dönüt beklemeden anında kullanıcıya geri dönmek için uygundur. Node.js-Kafka ikilisinde bu durum pek kullanışlı olmayabilir çünkü Node.js'de asenkron çalışır.
- Sunucularda birden fazla servis arasında iletişim kurmada yarar sağlar.

***Not: Mikro servisler temsilidir. Sadece Kafka iletişimi kuracak kadar çalışmaktadır. Ticaret senaryosundaki açıklar göz ardı edilmelidir.***

### Kafka Kullanımının Faydaları
- **Asenkron İletişim:** Servisler arasında hızlı veri akışı sağlar.
- **Genişletilebilirlik:** Yeni mikroservisler eklemek kolaydır.
- **Dayanıklılık:** Veri kaybı olmadan sistemin çalışmasını sürdürme yeteneği.
- **Gerçek Zamanlı İşlem:** Anlık veri işleme ve bildirimler için uygundur.
- **Geçmiş Verileri İnceleme:** Veriler depolandığı için geçmiş olaylar incelenebilir.


## KURULUM ve TEST
### Gerekenler
- Docker
- Node.js (+npm) OR CURL

#### Kullanılan Portlar
 - &nbsp; **3001:** Node.js port
 - **29092:** Kafka broker port
 - **39092:** Kafka broker port
 - **49092:** Kafka broker port

### Kurulum Sırası
1. **Kafka Broker ve Controller'ları Kuralım**
    ```sh
                   $> cd docker-kafka
    ./docker-kafka $> docker-compose up
    # Kafka kurulumunun bitmesini bekleyin
    ```
2. **Gerekli Topicleri Ekleyelim**
    ```sh
    $> docker exec -it kafka-main-broker_hk sh /home/init-kafka.sh
    ```
3. **Mikroservisleri Başlatalım**
    ```sh
               $> cd services
    ./services $> docker-compose up
    ```
4. **Post İşlemi Yapalım (Test)**

    Aşağıda verilen yöntemler dışında diğer POST yöntemlerini de kullanabilirsiniz. Örneğin Postman gibi araçlar tercih edebilirsiniz.


    - Eğer Node.js kullanıyorsanız:
        ```sh
               $> cd post
        ./post $> npm install  # axios dependency
        ./post $> node send_post.js --sell  # OR
        ./post $> node send_post.js --buy
        ```
    - Eğer CURL kullanıyorsanız: (for Windows)
        - Satış işlemi:
            ```console
            > curl -X POST http://localhost:3001/payment/sell -H "Content-Type: application/json" -d "{ \"adress\": \"ANKARA\", \"order\": [ { \"product_id\": 12, \"amount\": 3 }, { \"product_id\": 22, \"amount\": 1 }, { \"product_id\": 334, \"amount\": 6 } ], \"fake-credential\": { \"jwt\": { \"id\" : 78 } } }"
            ```
        - Satın alma işlemi:
            ```console
            > curl -X POST http://localhost:3001/payment/buy -H "Content-Type: application/json" -d "{ \"order\": [ { \"product_id\": 12, \"amount\": 3 }, { \"product_id\": 22, \"amount\": 1 }, { \"product_id\": 334, \"amount\": 6 } ], \"fake-credential\": { \"jwt\": { \"id\" : 78 } } }"
            ```
    - Eğer CURL kullanıyorsanız: (for Linux or WSL)
        - Satış işlemi:
            ```bash
            $ curl -X POST http://localhost:3001/payment/sell \
            -H "Content-Type: application/json" \
            -d '{
                "adress": "ANKARA",
                "order": [
                    {
                        "product_id": 12,
                        "amount": 3
                    },
                    {
                        "product_id": 22,
                        "amount": 1
                    },
                    {
                        "product_id": 334,
                        "amount": 6
                    }
                ],
                "fake-credential": {
                    "jwt": {
                        "id": 78
                    }
                }
            }'
            ```
        - Satın alma işlemi:
            ```bash
            $ curl -X POST http://localhost:3001/payment/buy \
            -H "Content-Type: application/json" \
            -d '{
                "order": [
                    {
                        "product_id": 12,
                        "amount": 3
                    },
                    {
                        "product_id": 22,
                        "amount": 1
                    },
                    {
                        "product_id": 334,
                        "amount": 6
                    }
                ],
                "fake-credential": {
                    "jwt": {
                        "id": 78
                    }
                }
            }'
            ```


### Zookeeper ile Aynı İşlemleri Yapabilirsiniz
**KRAFT VS ZOOKEEPER**  
KRAFT, yeni çıkan Kafka ile uyumlu ve daha performanslıdır, bu yüzden Kraft kullanımı daha mantıklıdır. Ayrıca kullandığımız Apache/Kafka imajı sadece Kraft'ı desteklemektedir.

[KRaft-Apache Kafka Konfigrasyonu](https://hub.docker.com/r/apache/kafka)

Ancak Zookeeper ile Kafka da kullanılabilir. Kraft'tan önce Bitnami'nin Zookeeper ile Kafka ikilisini kullandım. Bu, basit ilk kullanım içindi; ancak KRaft daha iyi olduğu için KRaft'a geçtim. Zookeeper ve Kafka kullanımının Docker dosyasına [buradan](./docker-kafka/.zookeeper.uses/docker-compose.yml) ulaşabilirsiniz. Zookeeper ile Kafka kullanımına göre servislerde gerekli konfigürasyonlar yapılmalıdır ve topicler oluşturulmalıdır.. Mikroservisler Docker'da çalışmadan önce localde test edilebilir.

