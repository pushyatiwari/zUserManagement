import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';

import type { User } from '../../types/user';
import type { Tab } from '../../constants/tabs';
import { TABS } from '../../constants/tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { TabButton } from '../../components/TabButton/TabButton';
import { homesStyles as styles } from './homsStyles';
import { useZellerUsers } from '../../hooks/useZellerUsers';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { users, loading, error, reload } = useZellerUsers();
  
  const filteredUsers = useMemo(() => {
    let data =
      activeTab === 'All' ? users : users.filter(u => u.role.toLowerCase() === activeTab.toLowerCase());

    if (!searchText.trim()) return data;

    return data.filter(u =>
      u.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [users, activeTab, searchText]);

  const keyExtractor = useCallback((item: User) => item.id, []);

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
    <View  style={styles.container}>
      {/* Tabs  */}
      <View testID="home-header" style={styles.tabContainer}>
        {isSearchOpen ? (
          // 🔍 SEARCH INPUT
          <TextInput
            testID="search-input"
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search users"
            autoFocus
            style={styles.searchInput}
          />
        ) : (
          // 🟦 TABS
          <View style={styles.tabs}>
            {TABS.map(tab => (
              <TabButton
                key={tab}
                title={tab}
                active={activeTab === tab}
                onPress={() => setActiveTab(tab)}
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
          accessibilityLabel="Search users"
        >
          <Icon
            name={isSearchOpen ? 'close' : 'search'}
            size={22}
            color="#2c6bed"
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={keyExtractor}
        refreshing={loading}
        onRefresh={reload}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => {
          // TODO: navigate to AddUser screen
        }}
        accessibilityLabel="Add user"
      >
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}
