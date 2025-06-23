import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { documentService } from "@/services";
import { groupService } from "@/services";
import { userService } from "@/services";
import { Document } from "@/services/Document";
import { Group } from "@/services/Group";
import { Color } from "@/constants/Styles";
import Navbar from "@/components/base/Navbar";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalGroups: 0,
    documentsByType: {} as Record<string, number>,
    usersByRole: {} as Record<string, number>,
    recentGroups: [] as Group[],
    recentDocuments: [] as Document[],
  });

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const cardWidth = isWeb
    ? width > 1200
      ? width / 4 - 30
      : width > 768
      ? width / 2 - 30
      : width - 40
    : width - 40;
  const chartWidth = isWeb
    ? width > 768
      ? width / 2 - 40
      : width - 40
    : width - 40;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data
        const [users, documents, groups] = await Promise.all([
          userService.getAllUsers(),
          documentService.getAllDocuments(),
          groupService.getAllGroups(),
        ]);

        // Process document types
        const docTypes: Record<string, number> = {};
        documents.forEach((doc) => {
          docTypes[doc.type] = (docTypes[doc.type] || 0) + 1;
        });

        // Process user roles
        const roles: Record<string, number> = {};
        users.forEach((user) => {
          const role = user.role || "pegawai";
          roles[role] = (roles[role] || 0) + 1;
        });

        // Sort recent items
        const sortedGroups = [...groups].sort((a, b) => {
          const dateA =
            a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
          const dateB =
            b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
          return dateB.getTime() - dateA.getTime();
        });

        const sortedDocuments = [...documents].sort((a, b) => {
          const dateA =
            a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
          const dateB =
            b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
          return dateB.getTime() - dateA.getTime();
        });

        setStats({
          totalUsers: users.length,
          totalDocuments: documents.length,
          totalGroups: groups.length,
          documentsByType: docTypes,
          usersByRole: roles,
          recentGroups: sortedGroups.slice(0, 5),
          recentDocuments: sortedDocuments.slice(0, 5),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primary} />
        <Text style={styles.loadingText}>Loading dashboard data...</Text>
      </View>
    );
  }

  // Prepare chart data
  const documentTypeData = {
    labels: Object.keys(stats.documentsByType).slice(0, 5),
    datasets: [
      {
        data: Object.values(stats.documentsByType).slice(0, 5),
      },
    ],
  };

  const userRoleData = {
    labels: Object.keys(stats.usersByRole),
    datasets: [
      {
        data: Object.values(stats.usersByRole),
      },
    ],
  };

  const pieChartData = Object.keys(stats.documentsByType).map((type, index) => {
    const colors = [
      Color.accent1,
      Color.accent2,
      Color.accent3,
      Color.accent4,
      Color.accent5,
    ];
    return {
      name: type,
      population: stats.documentsByType[type],
      color: colors[index % colors.length],
      legendFontColor: Color.text,
      legendFontSize: 12,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Navbar title="Dashboard" />

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { width: cardWidth }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={24} color={Color.text} />
            </View>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={[styles.statCard, { width: cardWidth }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="document-text" size={24} color={Color.text} />
            </View>
            <Text style={styles.statValue}>{stats.totalDocuments}</Text>
            <Text style={styles.statLabel}>Total Documents</Text>
          </View>

          <View style={[styles.statCard, { width: cardWidth }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="folder" size={24} color={Color.text} />
            </View>
            <Text style={styles.statValue}>{stats.totalGroups}</Text>
            <Text style={styles.statLabel}>Total Groups</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Documents by Type</Text>
          <View style={styles.chartContainer}>
            {Object.keys(stats.documentsByType).length > 0 ? (
              <PieChart
                data={pieChartData}
                width={chartWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <Text style={styles.noDataText}>
                No document type data available
              </Text>
            )}
          </View>
        </View>

        {/* <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>User Roles Distribution</Text>
          <View style={styles.chartContainer}>
            {Object.keys(stats.usersByRole).length > 0 ? (
              <BarChart
                data={userRoleData}
                width={chartWidth}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            ) : (
              <Text style={styles.noDataText}>No user role data available</Text>
            )}
          </View>
        </View> */}

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Documents</Text>
          {stats.recentDocuments.length > 0 ? (
            stats.recentDocuments.map((doc, index) => (
              <View key={doc.id || index} style={styles.recentItem}>
                <View style={styles.recentItemIcon}>
                  <Ionicons name="document-text" size={24} color={Color.text} />
                </View>
                <View style={styles.recentItemContent}>
                  <Text style={styles.recentItemTitle}>
                    {doc.type || "Unknown Type"}
                  </Text>
                  <Text style={styles.recentItemSubtitle}>
                    ID Pelanggan:{" "}
                    {
                      stats.recentGroups.find(
                        (group) => group.id === doc.groupId
                      )?.customerId
                    }
                  </Text>
                  <Text style={styles.recentItemDate}>
                    {doc.createdAt instanceof Date
                      ? doc.createdAt.toLocaleDateString()
                      : doc.createdAt.toDate().toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No recent documents</Text>
          )}
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Groups</Text>
          {stats.recentGroups.length > 0 ? (
            stats.recentGroups.map((group, index) => (
              <View key={group.id || index} style={styles.recentItem}>
                <View style={styles.recentItemIcon}>
                  <Ionicons name="folder" size={24} color={Color.text} />
                </View>
                <View style={styles.recentItemContent}>
                  <Text style={styles.recentItemTitle}>
                    ID Pelanggan: {group.customerId || "Tidak ada ID Pelanggan"}
                  </Text>
                  <Text style={styles.recentItemSubtitle}>
                    Jumlah Dokumen: {group.documentCount}
                  </Text>
                  <Text style={styles.recentItemDate}>
                    {group.createdAt instanceof Date
                      ? group.createdAt.toLocaleDateString()
                      : group.createdAt.toDate().toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No recent groups</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  refreshButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
  },
  chartSection: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  recentSection: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  recentItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.accent1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  recentItemSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  recentItemDate: {
    fontSize: 12,
    color: "#999999",
    marginTop: 2,
  },
  noDataText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    padding: 20,
  },
});

export default AdminDashboard;
