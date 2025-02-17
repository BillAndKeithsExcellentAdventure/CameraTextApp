import React, { useState, useEffect } from "react";
import { View, Button, Image, Alert, Text } from "react-native";
import { JobTrakrDB } from "jobdb";

const JobDatabase: React.FC = () => {
    const doDatabaseStuff = async () => {
        try {
        } catch (error) {
            console.error("Error creating database: ", error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button
                title="Database Stuff"
                onPress={doDatabaseStuff}
            />
        </View>
    );
};

export default JobDatabase;
