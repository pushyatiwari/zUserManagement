import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { Modal } from 'react-native';

import type { User } from '../../types/user';
import type { Tab } from '../../constants/tabs';
import { TABS } from '../../constants/tabs';
import { TabButton } from '../../components/TabButton/TabButton';
import { homesStyles as styles, TAB_WIDTH } from './homeStyles';
import { useZellerUsersDb } from '../../hooks/useZellerUsersDb';
import { AddUserForm } from '../../components/AddUserForm/AddUserForm';
import type { NewDbUserInput } from '../../db/zellerDb';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
const TOP_VISUAL_OFFSET = 20;

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const insets = useSafeAreaInsets();

  const { users, error, addUser, loading } = useZellerUsersDb();

  const pagerRef = useRef<PagerView>(null);

  const position = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(0)).current;
  const progress = Animated.add(position, offset);

  const translateX = progress.interpolate({
    inputRange: TABS.map((_, i) => i),
    outputRange: TABS.map((_, i) => i * TAB_WIDTH),
  });

  const getUsersForTab = useCallback(
    (tab: Tab) => {
      let data =
        tab === 'All'
          ? users
          : users.filter(u => u.role.toLowerCase() === tab.toLowerCase());

      const q = searchText.trim().toLowerCase();
      if (!q) return data;
      // search will filter across all users
      return users.filter(u => u.name.toLowerCase().includes(q));
    },
    [users, searchText],
  );

  const keyExtractor = useCallback((item: User) => item.id, []);

  const addUserHelper = useCallback(
    async (values: NewDbUserInput) => {
      await addUser(values);
      setIsAddModalOpen(false);
    },
    [addUser],
  );

  const renderItem = useCallback(({ item }: { item: User }) => {
    const firstLetter = item.name.trim()[0]?.toUpperCase() ?? '?';

    return (
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.role}>{item.role}</Text>
      </View>
    );
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top - TOP_VISUAL_OFFSET } ]}>
      <View testID="home-header" style={styles.tabContainer}>
        {isSearchOpen ? (
          <TextInput
            testID="search-input"
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search users"
            autoFocus
            style={styles.searchInput}
          />
        ) : (
          <View style={styles.tabs}>
            <Animated.View
              style={[styles.activeIndicator, { transform: [{ translateX }] }]}
            />

            {TABS.map((tab, i) => (
              <TabButton
                key={tab}
                title={tab}
                active={activeTab === tab}
                onPress={() => {
                  setActiveTab(tab);
                  pagerRef.current?.setPage(i);
                }}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          testID="search-button"
          style={styles.searchButton}
          onPress={() => {
            setIsSearchOpen(prev => !prev);
            setSearchText('');
          }}
        >
          {isSearchOpen ? (
            <XMarkIcon size={22} color="#2c6bed" />
          ) : (
            <MagnifyingGlassIcon size={22} color="#2c6bed" />
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <AnimatedPagerView
        ref={pagerRef}
        initialPage={0}
        style={{ flex: 1 }}
        onPageScroll={Animated.event([{ nativeEvent: { position, offset } }], {
          useNativeDriver: true,
        })}
        onPageSelected={e => {
          const idx = e.nativeEvent.position;
          setActiveTab(TABS[idx] ?? 'All');
        }}
      >
        {TABS.map(tab => (
          <View key={tab} style={{ flex: 1 }}>
            <FlatList
              data={getUsersForTab(tab)}
              keyExtractor={keyExtractor}
              refreshing={loading}
              renderItem={renderItem}
              ItemSeparatorComponent={Separator}
              contentContainerStyle={styles.listContent}
            />
          </View>
        ))}
      </AnimatedPagerView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        testID="add_user_btn"
        onPress={() => setIsAddModalOpen(true)}
      >
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>

      <Modal visible={isAddModalOpen} transparent animationType="fade">
        <View style={styles.addFormModalWrapper}>
          <AddUserForm
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={addUserHelper}
          />
        </View>
      </Modal>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}
