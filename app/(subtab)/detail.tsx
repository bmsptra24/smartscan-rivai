import { View, FlatList, Image } from "react-native";
import { Component, PureComponent } from "react";
import Container from "@/components/base/Container";
import TextBase from "@/components/base/Text";
import { Color, Size, Distance, BorderRadius } from "@/constants/Styles";
import ButtonBase from "@/components/base/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import IconButton from "@/components/base/IconButton";
import Header from "@/components/base/Header";
import { documentService } from "@/services";
import { Document } from "@/services/Document";
import useGroupStore from "@/stores/Group";
import { StoreProps, useStore } from "@/stores";

interface ScrollEvent {
  nativeEvent: {
    contentOffset: {
      x: number;
    };
  };
}

interface Props {}

export class Detail extends Component<StoreProps> {
  state = {
    currentIndex: 0,
    documents: [] as Document[],
    customerId: undefined as string | undefined,
    updatedAt: undefined as Date | undefined,
  };

  async componentDidMount() {
    const { selectedGroup } = this.props.group;
    if (!selectedGroup) return console.error("Group not found");

    const documents = await documentService.getDocumentsByGroupId(
      selectedGroup.id
    );

    console.log({ selectedGroup });

    this.setState({ documents });
  }

  handleScrollEnd = (e: ScrollEvent) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / Size.screen.width);
    this.setState({ currentIndex });
  };

  render() {
    const screenWidth = Size.screen.width - Distance.default * 2; // Account for horizontal padding
    // A4 aspect ratio is 1:√2 (approximately 1:1.414)
    const a4Height = screenWidth * 1.414;

    return (
      <>
        <Container>
          <View
            style={{
              // height: Size.screen.height,
              paddingVertical: Distance.default,
              paddingHorizontal: Distance.default,
              gap: Distance.default,
            }}
          >
            {/* Header */}
            <Header title="Detail" />

            {/* Preview Image Section */}
            {this.state.documents.length > 0 ? (
              <View
                style={{
                  width: screenWidth,
                  height: a4Height,
                  aspectRatio: 1 / 1.414, // A4 aspect ratio (width:height)
                  alignSelf: "center",
                }}
              >
                <FlatList
                  data={this.state.documents}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={this.handleScrollEnd}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        width: screenWidth,
                        height: a4Height,
                        backgroundColor: Color.greyLight,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: BorderRadius.default,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={{ uri: item.image_url }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "contain",
                        }}
                        onError={(error) =>
                          console.log("Error loading image:", error)
                        }
                      />
                    </View>
                  )}
                />

                {/* Page Indicator */}
                <View
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  {this.state.documents.map((_, index) => (
                    <View
                      key={index}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          index === this.state.currentIndex
                            ? Color.primary
                            : Color.greyLight,
                      }}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <TextBase variant="header">Tidak ada dokumen.</TextBase>
            )}

            {/* Detail Informasi */}
            <View
              style={{
                flex: 1,
                gap: Distance.default,
                marginTop: 20, // Add space for the page indicator
              }}
            >
              <View>
                <TextBase variant="header">ID Pelanggan</TextBase>
                <TextBase variant="content">
                  {this.props.group.selectedGroup.customerId}
                </TextBase>
              </View>

              <View>
                <TextBase variant="header">Jumlah</TextBase>
                <TextBase variant="content">
                  {this.state.documents.length} Halaman
                </TextBase>
              </View>

              <View>
                <TextBase variant="header">Tanggal update</TextBase>
                <TextBase variant="content">
                  {this.props.group.selectedGroup.updatedAt?.toLocaleString()}
                </TextBase>
              </View>
            </View>
          </View>
        </Container>
        {/* Tombol Aksi */}
        <View
          style={{
            flexDirection: "row",
            gap: Distance.default,
            paddingVertical: Distance.default,
            paddingHorizontal: Distance.default,
            backgroundColor: Color.background,
          }}
        >
          <ButtonBase
            style={{ flex: 1 }}
            textStyle={{ color: Color.text }}
            title="Edit"
            onPress={() => router.push("/(subtab)/edit")}
          />
          <IconButton
            style={{ backgroundColor: Color.secondary }}
            icon={
              <MaterialCommunityIcons
                name="share"
                size={24}
                color={Color.text}
              />
            }
            onPress={() => {}}
          />
        </View>
      </>
    );
  }
}

export default useStore(Detail);
