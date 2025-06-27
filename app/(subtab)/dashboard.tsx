import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, PieChart } from "react-native-chart-kit"; // LineChart is not used in original, keeping BarChart and PieChart
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Import for gradients
// --- MOCK DATA & SERVICES (replace with your actual imports) ---
// Since the original services are external, we mock them for a runnable example.
// Replace these with your actual service and type imports:
import { documentService } from "@/services";
import { groupService } from "@/services";
import { userService } from "@/services";
import { Document } from "@/services/Document";
import { Group } from "@/services/Group";
import { Color as COLORS } from "@/constants/Styles";
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

  // Calculate cardWidth for 3 columns on web, accounting for padding and gaps
  // scrollViewContent has paddingHorizontal: 16 (total 32px)
  // statsContainer has gap: 16 (total 2 gaps = 32px)
  const contentPaddingHorizontal = 16;
  const statCardGap = 16;
  const totalHorizontalSpace =
    contentPaddingHorizontal * 2 + statCardGap * 2 + 230; // 32px padding + 32px gaps

  // Using Math.floor to ensure integer pixel values, which can prevent unexpected wrapping
  const cardWidth = isWeb
    ? Math.floor((width - totalHorizontalSpace) / 3) // Always 3 cards per row on web
    : width - contentPaddingHorizontal * 2; // Full width on mobile (adjusted to use contentPaddingHorizontal)

  // chartWidth calculation remains the same, adjusted for common practices
  const chartWidth = isWeb
    ? Math.floor(
        width > 768
          ? (width - totalHorizontalSpace) / 2 // Half width for charts on larger web screens if in a two-column layout
          : width - totalHorizontalSpace
      ) // Full width for charts on smaller web screens
    : width - contentPaddingHorizontal * 2; // Full width on mobile (adjusted)

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
          const role = user.role || "pegawai"; // Default role if not defined
          roles[role] = (roles[role] || 0) + 1;
        });

        // Sort recent items (latest first)
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
          recentGroups: sortedGroups.slice(0, 5), // Show top 5 recent groups
          recentDocuments: sortedDocuments.slice(0, 5), // Show top 5 recent documents
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after initial render

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryBlue} />
        <Text style={styles.loadingText}>Loading dashboard data...</Text>
      </View>
    );
  }

  // Prepare chart data for PieChart (Documents by Type)
  // Ensure enough distinct colors for pie slices
  const pieChartColors = [
    COLORS.accentBlue1,
    COLORS.accentBlue2,
    COLORS.accentBlue3,
    COLORS.primaryBlue,
    COLORS.lightBlue,
    COLORS.darkBlue,
  ];

  const pieChartData = Object.keys(stats.documentsByType).map((type, index) => {
    return {
      name: type,
      population: stats.documentsByType[type],
      color: pieChartColors[index % pieChartColors.length], // Cycle through defined colors
      legendFontColor: COLORS.textPrimary,
      legendFontSize: 12,
    };
  });

  // Prepare chart data for BarChart (User Roles Distribution)
  const userRoleData = {
    labels: Object.keys(stats.usersByRole),
    datasets: [
      {
        data: Object.values(stats.usersByRole),
        colors: Object.keys(stats.usersByRole).map(
          (_, index) =>
            (opacity = 1) =>
              pieChartColors[index % pieChartColors.length] // Use same color palette for bars
        ),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar title="Admin Dashboard" />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.statCard, { width: cardWidth }]}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={28} color={COLORS.darkBlue} />
            </View>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </LinearGradient>

          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.statCard, { width: cardWidth }]}
          >
            <View style={styles.statIconContainer}>
              <Ionicons
                name="document-text"
                size={28}
                color={COLORS.darkBlue}
              />
            </View>
            <Text style={styles.statValue}>{stats.totalDocuments}</Text>
            <Text style={styles.statLabel}>Total Documents</Text>
          </LinearGradient>

          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.statCard, { width: cardWidth }]}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="folder" size={28} color={COLORS.darkBlue} />
            </View>
            <Text style={styles.statValue}>{stats.totalGroups}</Text>
            <Text style={styles.statLabel}>Total Groups</Text>
          </LinearGradient>
        </View>

        {/* Documents by Type Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Documents by Type</Text>
          <View style={styles.chartContainer}>
            {Object.keys(stats.documentsByType).length > 0 ? (
              <PieChart
                data={pieChartData}
                width={chartWidth}
                height={220}
                chartConfig={{
                  backgroundColor: COLORS.cardBackground, // Background of the chart area
                  backgroundGradientFrom: COLORS.cardBackground,
                  backgroundGradientTo: COLORS.cardBackground,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Default color for labels
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForLabels: {
                    fontSize: 10, // Adjust label font size
                    fill: COLORS.textPrimary,
                  },
                }}
                accessor="population"
                backgroundColor="transparent" // Pie chart itself has transparent background
                paddingLeft="15"
                absolute // Show absolute values in legend
              />
            ) : (
              <Text style={styles.noDataText}>
                No document type data available
              </Text>
            )}
          </View>
        </View>

        {/* User Roles Distribution Chart (Uncomment if needed) */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>User Roles Distribution</Text>
          <View style={styles.chartContainer}>
            {Object.keys(stats.usersByRole).length > 0 ? (
              <BarChart
                data={userRoleData}
                width={chartWidth}
                height={250}
                yAxisLabel="" // No y-axis label
                yAxisSuffix="" // No y-axis suffix
                chartConfig={{
                  backgroundColor: COLORS.cardBackground,
                  backgroundGradientFrom: COLORS.cardBackground,
                  backgroundGradientTo: COLORS.cardBackground,
                  decimalPlaces: 0, // No decimal places for counts
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Blue color for bars
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black labels for axis
                  barPercentage: 0.8, // Make bars a bit wider
                  propsForBackgroundLines: {
                    strokeDasharray: "", // Solid background lines
                    stroke: COLORS.divider, // Light blue lines
                  },
                  propsForLabels: {
                    fontSize: 10, // Adjust label font size
                    fill: COLORS.textSecondary,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                verticalLabelRotation={30} // Rotate labels if they overlap
              />
            ) : (
              <Text style={styles.noDataText}>No user role data available</Text>
            )}
          </View>
        </View>

        {/* Recent Documents Section */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Documents</Text>
          {stats.recentDocuments.length > 0 ? (
            stats.recentDocuments.map((doc, index) => (
              <View key={doc.id || `doc-${index}`} style={styles.recentItem}>
                <LinearGradient
                  colors={[COLORS.accentBlue1, COLORS.accentBlue2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.recentItemIcon}
                >
                  <Ionicons
                    name="document-text"
                    size={22}
                    color={COLORS.textLight}
                  />
                </LinearGradient>
                <View style={styles.recentItemContent}>
                  <Text style={styles.recentItemTitle}>
                    {doc.type || "Unknown Type"}
                  </Text>
                  {/* Find customerId from recentGroups based on doc.groupId */}
                  <Text style={styles.recentItemSubtitle}>
                    ID Pelanggan:{" "}
                    {stats.recentGroups.find(
                      (group) => group.id === doc.groupId
                    )?.customerId || "N/A"}
                  </Text>
                  <Text style={styles.recentItemDate}>
                    {doc.createdAt instanceof Date
                      ? doc.createdAt.toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : doc.createdAt.toDate().toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No recent documents</Text>
          )}
        </View>

        {/* Recent Groups Section */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Groups</Text>
          {stats.recentGroups.length > 0 ? (
            stats.recentGroups.map((group, index) => (
              <View
                key={group.id || `group-${index}`}
                style={styles.recentItem}
              >
                <LinearGradient
                  colors={[COLORS.accentBlue2, COLORS.accentBlue3]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.recentItemIcon}
                >
                  <Ionicons name="folder" size={22} color={COLORS.textLight} />
                </LinearGradient>
                <View style={styles.recentItemContent}>
                  <Text style={styles.recentItemTitle}>
                    ID Pelanggan: {group.customerId || "Tidak ada ID Pelanggan"}
                  </Text>
                  <Text style={styles.recentItemSubtitle}>
                    Jumlah Dokumen: {group.documentCount}
                  </Text>
                  <Text style={styles.recentItemDate}>
                    {group.createdAt instanceof Date
                      ? group.createdAt.toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : group.createdAt.toDate().toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
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
    backgroundColor: COLORS.backgroundLight, // Light blue background
  },
  // Navbar Styles
  navbar: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 25, // Rounded corners for professional look
    borderBottomRightRadius: 25,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    marginBottom: 20, // Add space below navbar
  },
  navbarTitle: {
    fontSize: 24,
    fontWeight: "700", // Bolder title
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 30, // Extra padding at the bottom
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Tetap flex-start untuk packing rapat
    marginBottom: 20,
    gap: 16, // Gunakan gap untuk spasi antar kartu
  },
  statCard: {
    borderRadius: 15, // Lebih banyak sudut membulat
    padding: 20,
    marginBottom: 0, // Gap menangani spasi vertikal sekarang
    alignItems: "flex-start", // Sejajarkan konten ke awal
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    flexGrow: 0, // Pastikan kartu tidak tumbuh melebihi lebar yang dihitung
    flexShrink: 0, // Pastikan kartu tidak menyusut, memaksa mereka tetap satu baris
  },
  statIconContainer: {
    width: 55, // Wadah ikon sedikit lebih besar
    height: 55,
    borderRadius: 27.5,
    backgroundColor: COLORS.textLight, // Latar belakang putih untuk ikon agar kontras dengan gradien
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  statValue: {
    fontSize: 32, // Ukuran teks nilai lebih besar
    fontWeight: "bold",
    color: COLORS.textLight, // Teks putih untuk kontras
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 15,
    color: COLORS.textLight, // Teks putih
    fontWeight: "500",
  },
  chartSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 20, // Judul bagian lebih besar
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 18,
    borderBottomWidth: 1, // Garis pembatas halus
    borderBottomColor: COLORS.divider,
    paddingBottom: 10,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  recentSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider, // Pembatas biru muda
  },
  recentItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24, // Ikon melingkar
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: COLORS.shadowColor, // Bayangan juga untuk ikon
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 17,
    fontWeight: "600", // Sedikit lebih tebal
    color: COLORS.textPrimary,
  },
  recentItemSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  recentItemDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  noDataText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: 30,
    fontStyle: "italic",
  },
});

export default AdminDashboard;
