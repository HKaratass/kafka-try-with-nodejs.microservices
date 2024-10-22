#!/bin/bash
cd /opt/kafka/bin/
./kafka-topics.sh --create --topic inventory-topic --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --partitions 1 --replication-factor 1
./kafka-topics.sh --create --topic shipping-topic --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --partitions 1 --replication-factor 1
./kafka-topics.sh --create --topic sms-topic --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --partitions 1 --replication-factor 1
./kafka-topics.sh --create --topic email-topic --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --partitions 1 --replication-factor 1