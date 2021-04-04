// New revoltmod

Cheat.Print("------------------- Revoltmod v2 -------------------" + " \n");
Cheat.Print("------------ Changelog 27.02.2021 18:45 ------------" + " \n");
Cheat.Print("[+] Reworked mod" + " \n");
Cheat.Print("[+] I remove hotkey list and now it shown in indicator" + " \n");
Cheat.Print("[+] Reworked watermark (now shown gamerules and alpha-channel support) " + " \n");
Cheat.Print("[+] New Damage Override and Low Delta" + " \n");
Cheat.Print("[+] Little Changed Clantag and Ragelog" + " \n");
Cheat.Print("------------ Changelog 01.03.2021 22:56 ------------" + " \n");
Cheat.Print("[+] Added Ping Spike " + " \n");
Cheat.Print("------------ Changelog 23.03.2021 16:38 ------------" + " \n");
Cheat.Print("[+] Added Customized Watermark " + " \n");

// -- VAR's --
var screen_size = Render.GetScreenSize();
var screen_half_x = screen_size[0] / 2;
var screen_half_y = screen_size[1] / 2;
var save_damage_pistol = true;
var save_damage_heavy = true;
var save_damage_scout = true;
var save_damage_awp = true;
var save_damage_auto = true;
var save_lowdelta = true
var original_aa = true;
var ping_spike_control = true
var lasttime = 0;

// -- UI buttons --
UI.AddLabel("            Revoltmod")
UI.AddLabel("-------------------------------");
UI.AddSliderInt("Antiaim X", 0, screen_size[0]);
UI.AddSliderInt("Antiaim Y", 0, screen_size[1]);
UI.AddLabel("-------------------------------");
UI.AddCheckbox("Low delta");
UI.AddHotkey("Legit AA Key");
UI.AddCheckbox("Clantag");
UI.AddHotkey("Ping Spike on Key");
UI.AddLabel("-------------------------------");
UI.AddCheckbox( "Aspect Ratio");
UI.AddSliderFloat("Aspect Ratio Value", 0, 5);
UI.AddLabel("-------------------------------");
UI.AddHotkey("Left");
UI.AddHotkey("Right");
UI.AddLabel("-------------------------------");
UI.AddHotkey("Minimum Damage Override");
UI.AddSliderInt("Pistol Override", 0, 130);
UI.AddSliderInt("Heavy Override", 0, 130);
UI.AddSliderInt("Scout Override", 0, 130);
UI.AddSliderInt("AWP Override", 0, 130);
UI.AddSliderInt("Autosniper Override", 0, 130);
UI.AddLabel("-------------------------------");
UI.AddCheckbox("Draw Watermark");
UI.AddCheckbox("Custom Username");
UI.AddTextbox("Username");
UI.AddLabel("-------------------------------");
UI.AddColorPicker("Watermark Color");
UI.AddLabel("-------------------------------");
UI.AddLabel("-------------------------------");

// -- Functions --

UI.SetValue("Misc", "GENERAL", "Miscellaneous", "Hidden cvars", true)

// -- Ping Spike --

function rev_pingspike() 
{
    if (UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", "Ping Spike on Key")) 
    {
        if (ping_spike_control) 
        {
            ps_cache = UI.GetValue("Misc", "GENERAL", "Miscellaneous", "Extended backtracking");
            ping_spike_control = false
        }
        UI.SetValue("Misc", "GENERAL", "Miscellaneous", "Extended backtracking", true);
    } 
    else 
    {
        if(!ping_spike_control) 
        {
            UI.SetValue("Misc", "GENERAL", "Miscellaneous", "Extended backtracking", ps_cache);
            ping_spike_control = true
        }
    }
}

// -- Fake Indicator --

function in_bounds(vec, x, y, x2, y2)
{
   return (vec[0] > x) && (vec[1] > y) && (vec[0] < x2) && (vec[1] < y2)
}

function main_aa() {
    if (!World.GetServerString()) return;

    const x = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Antiaim X"),
        y = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Antiaim Y");

    var font = Render.AddFont("Verdana", 7, 100);
    var RealYaw = Local.GetRealYaw();
    var FakeYaw = Local.GetFakeYaw();
    var delta = Math.min(Math.abs(RealYaw - FakeYaw) / 2, 60).toFixed(1);
    var safety = Math.min(Math.round(1.7 * Math.abs(delta)), 100);
    if (UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter")) {
        var side = "<";
    } else {
        var side = ">";
    }
    var text = "FAKE (" + delta.toString() + "  ) | safety: " + safety.toString() + "% | side: " + side;
    var w = Render.TextSizeCustom(text, font)[0] + 8;
    var x3 = x - w - 3;
    color_f = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Fake Color");

    Render.FilledRect(x3, y + 2, 2, 18, [ color_f[0], color_f[1], color_f[2], 255 ]);
    Render.StringCustom(x + 5 - w, y + 5, 0, text, [0, 0, 0, 180], font);
    Render.StringCustom(x + 4 - w, y + 4, 0, text, [255, 255, 255, 255], font);
    Render.Circle(x + 5 - w + Render.TextSizeCustom("FAKE (" + delta.toString(), font)[0], y + 8, 1, [255, 255, 255, 255]);
    if (Global.IsKeyPressed(1) && UI.IsMenuOpen()) {
        const mouse_pos = Global.GetCursorPosition();
        if (in_bounds(mouse_pos, x - w, y, x + w, y + 30)) {
            UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Antiaim X", mouse_pos[0] + w / 2);
            UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Antiaim Y", mouse_pos[1] - 20);
        }
    }
}

// -- Aspect Ratio --

function aspectration() 
{
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Aspect Ratio", true)) 
    {
        UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Aspect Ratio Value", true);
        ratio = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Aspect Ratio Value").toString();
        switch (Global.FrameStage()) 
        {
            case 5: 
            {
                Global.ExecuteCommand( "r_aspectratio " + ratio );
                break;
            }
            default: break;
        } 
    } 
    else 
    {
        Cheat.ExecuteCommand("r_aspectratio 0")
        UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Aspect Ratio Value", false);
    }
}

// -- Clantag --

function mod_clantag() {
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Clantag")) 
    {
        UI.SetValue("Misc", "GENERAL", "Miscellaneous", "Clantag", 0)
        var time = parseInt((Globals.Curtime() * 6))
        if (time != lasttime)
        {
            if(UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Clantag", true))
            {
                switch((time) % 34)
                {
                    case 1: { Local.SetClanTag(" "); break; }
                    case 2: { Local.SetClanTag(" | "); break; }
                    case 3: { Local.SetClanTag(" R"); break; }
                    case 4: { Local.SetClanTag(" R|-"); break; }
                    case 5: { Local.SetClanTag(" RE"); break; }
                    case 6: { Local.SetClanTag(" Re"); break; }
                    case 7: { Local.SetClanTag(" ReV "); break; }
                    case 8: { Local.SetClanTag(" Rev"); break; }
                    case 9: { Local.SetClanTag(" Rev0"); break; }
                    case 10: { Local.SetClanTag(" Revo"); break; }
                    case 11: { Local.SetClanTag(" Revo|_"); break; }
                    case 12: { Local.SetClanTag(" Revol"); break; }
                    case 13: { Local.SetClanTag(" Revol! "); break; }
                    case 14: { Local.SetClanTag(" Revolt"); break; }
                    case 15: { Local.SetClanTag(" Revolt# "); break; }
                    case 16: { Local.SetClanTag(" RevoltM"); break; }
                    case 17: { Local.SetClanTag(" RevoltM0"); break; }
                    case 18: { Local.SetClanTag(" RevoltMo"); break; }
                    case 19: { Local.SetClanTag(" RevoltMoo|"); break; }
                    case 20: { Local.SetClanTag(" RevoltMod"); break; }
                    case 21: { Local.SetClanTag(" RevoltMod"); break; }
                    case 22: { Local.SetClanTag(" RevoltMod <"); break; }
                    case 23: { Local.SetClanTag(" RevoltMo <"); break; }
                    case 24: { Local.SetClanTag(" RevoltM <"); break; }
                    case 25: { Local.SetClanTag(" Revolt <"); break; }
                    case 26: { Local.SetClanTag(" Revol <"); break; }
                    case 27: { Local.SetClanTag(" Revo <"); break; }
                    case 28: { Local.SetClanTag(" Rev <"); break; }
                    case 29: { Local.SetClanTag(" Re <"); break; }
                    case 30: { Local.SetClanTag(" R <"); break; }
                    case 31: { Local.SetClanTag(" <"); break; }
                    case 32: { Local.SetClanTag(" _"); break; }
                    case 33: { Local.SetClanTag(" "); break; }
                }
            } 
            else 
            {
                Local.SetClanTag("  ");
            }
        }
        lasttime = time;
    }
}

// -- Hit Log --

function getHitboxName(index)
{
    var hitboxName = "";
    switch (index)
    {
        case 0:
            hitboxName = "Head";
            break;
        case 1:
            hitboxName = "Neck";
            break;
        case 2:
            hitboxName = "Pelvis";
            break;
        case 3:
            hitboxName = "Body";
            break;
        case 4:
            hitboxName = "Thorax";
            break;
        case 5:
            hitboxName = "Chest";
            break;
        case 6:
            hitboxName = "Upper chest";
            break;
        case 7:
            hitboxName = "Left thigh";
            break;
        case 8:
            hitboxName = "Right thigh";
            break;
        case 9:
            hitboxName = "Left calf";
            break;
        case 10:
            hitboxName = "Right calf";
            break;
        case 11:
            hitboxName = "Left foot";
            break;
        case 12:
            hitboxName = "Right foot";
            break;
        case 13:
            hitboxName = "Left hand";
            break;
        case 14:
            hitboxName = "Right hand";
            break;
        case 15:
            hitboxName = "Left upper arm";
            break;
        case 16:
            hitboxName = "Left forearm";
            break;
        case 17:
            hitboxName = "Right upper arm";
            break;
        case 18:
            hitboxName = "Right forearm";
            break;
        default:
            hitboxName = "Generic";
    }

    return hitboxName;
};

function ragebotLogs_player_damage() {
    ragebot_target_damage = Event.GetInt("dmg_health");
}

function ragebotLogs()
{
    ragebot_target = Event.GetInt("target_index");
    ragebot_target_hitbox = Event.GetInt("hitbox");
    ragebot_target_hitchance = Event.GetInt("hitchance");
    ragebot_target_safepoint = Event.GetInt("safepoint");
    ragebot_target_exploit = Event.GetInt("exploit");
    targetName = Entity.GetName(ragebot_target)
        
    Cheat.PrintColor([240, 15, 15, 255], "\x01[ \x02Revoltmod \x01] TARGET: " + targetName + " DAMAGE: " + ragebot_target_damage.toString() +" HITBOX: " + getHitboxName(ragebot_target_hitbox) + " HC: " + ragebot_target_hitchance + " EXPLOIT: " + ragebot_target_exploit + " \n");
    Cheat.PrintChat("\x01[ \x02Revoltmod \x01] TARGET: " + targetName + " DAMAGE: " + ragebot_target_damage.toString() +" HITBOX: " + getHitboxName(ragebot_target_hitbox) + " HC: " + ragebot_target_hitchance + " EXPLOIT: " + ragebot_target_exploit + " \n");
}

// -- Damage Override

function weapons_dmg_override() 
{
    var override_status = UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script Items", "Minimum Damage Override");
    var localplayer_index = Entity.GetLocalPlayer();
    var localplayer_weapon = Entity.GetWeapon(localplayer_index);
    var weapon_name = Entity.GetName(localplayer_weapon).toString();
    var pistol_override = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Pistol Override");
    var heavy_override = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Heavy Override");
    var scout_override = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Scout Override");
    var awp_override = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "AWP Override");
    var auto_override = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Autosniper Override");

    // -- Pistol Override --

    if (override_status == true && (weapon_name == "dual berretas" || weapon_name == "five seven" || weapon_name == "glock 18" || weapon_name == "tec 9" || weapon_name == "p250" || weapon_name == "usp s" || weapon_name == "cz75 auto"))
    {
        if (save_damage_pistol) 
        {
            pistol_override_bk = UI.GetValue("Rage", "PISTOL", "Targeting", "Minimum damage");
            save_damage_pistol = false;
        }
        UI.SetValue("Rage", "PISTOL", "Targeting", "Minimum damage", pistol_override);
    } else 
    {
        if(!save_damage_pistol)
        {
            UI.SetValue("Rage", "PISTOL", "Targeting", "Minimum damage", pistol_override_bk);
            save_damage_pistol = true
        }
    }   

    // -- Heavy Override --

    if (override_status == true && (weapon_name == "r8 revolver" || weapon_name == "desert eagle")) 
    {
        if (save_damage) 
        {
            heavy_override_bk = UI.GetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage");
            save_damage_heavy = false;
        }
        UI.SetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage", heavy_override);
    } else 
    {
        if(!save_damage_heavy)
        {
            UI.SetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage", heavy_override_bk);
            save_damage_heavy = true
        }
    }

    // -- Scout Override --

    if (override_status == true && weapon_name == "ssg 08") 
    {
        if (save_damage_scout) 
        {
            scout_override_bk = UI.GetValue("Rage", "SCOUT", "Targeting", "Minimum damage");
            save_damage_scout = false;
        }
        UI.SetValue("Rage", "SCOUT", "Targeting", "Minimum damage", scout_override);
    } else 
    {
        if(!save_damage_scout)
        {
            UI.SetValue("Rage", "SCOUT", "Targeting", "Minimum damage", scout_override_bk);
            save_damage_scout = true
        }
    }

    // -- AWP Override --

    if (override_status == true && weapon_name == "awp") 
    {
        if (save_damage_awp) 
        {
            awp_override_bk = UI.GetValue("Rage", "AWP", "Targeting", "Minimum damage");
            save_damage_awp = false;
        }
        UI.SetValue("Rage", "AWP", "Targeting", "Minimum damage", awp_override);
    } else 
    {
        if(!save_damage_awp)
        {
            UI.SetValue("Rage", "AWP", "Targeting", "Minimum damage", awp_override_bk);
            save_damage_awp = true
        }
    }

    // -- Autosniper Override --

    if (override_status == true && (weapon_name == "scar 20" || weapon_name == "g3sg1")) 
    {
        if (save_damage_auto) 
        {
            auto_override_bk = UI.GetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage");
            save_damage_auto = false;
        }
        UI.SetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage", auto_override);
    } else 
    {
        if(!save_damage_auto)
        {
            UI.SetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage", auto_override_bk);
            save_damage_auto = true
        }
    }
}

// -- Legit AA on Key --

function legit_aa()
{
    if (UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", "Legit AA Key"))
    {
        if (original_aa)
        {
            restrictions_cache = UI.GetValue("Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions");
            hiderealangle_cache = UI.GetValue ("Anti-Aim", "Fake angles", "Hide real angle");
            yaw_offset_cache = UI.GetValue ("Anti-Aim", "Rage Anti-Aim", "Yaw offset");
            jitter_offset_cache = UI.GetValue ("Anti-Aim", "Rage Anti-Aim", "Jitter offset");
            pitch_cache = UI.GetValue ("Anti-Aim", "Extra", "Pitch");
            autodir_cache = UI.GetValue ("Anti-Aim", "Rage Anti-Aim", "Auto direction");
            original_aa = false;
        }
        UI.SetValue ("Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions", 0);
        UI.SetValue ("Anti-Aim", "Fake angles", "Hide real angle", true);
        UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 180);
        UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Jitter offset", 0);
        UI.SetValue ("Anti-Aim", "Extra", "Pitch", 0);
        UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Auto direction", false);
    }
    else
    {
        if (!original_aa)
        {
            UI.SetValue ("Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions", restrictions_cache);
            UI.SetValue ("Anti-Aim", "Fake angles", "Hide real angle", hiderealangle_cache);
            UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Yaw offset", yaw_offset_cache);
            UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Jitter offset", jitter_offset_cache);
            UI.SetValue ("Anti-Aim", "Extra", "Pitch", pitch_cache);
            UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Auto direction", autodir_cache);
            original_aa = true;
        }
    }
}

// -- Indicators --

function revolt_indicators() 
{
    var lby_type = UI.GetValue("Anti-Aim", "Fake angles", "LBY mode");
    var dt_actived = UI.IsHotkeyActive("Rage", "GENERAL", "Exploits", "Doubletap");
    var onshot_actived = UI.IsHotkeyActive("Rage", "GENERAL", "Exploits", "Hide shots");
    var dt_charge = Exploit.GetCharge();
    var localplayer_index = Entity.GetLocalPlayer();
    var localplayer_weapon = Entity.GetWeapon(localplayer_index);
    var weapon_name = Entity.GetName(localplayer_weapon).toString();
    var dmg_override_actived = UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script Items", "Minimum Damage Override");
    var legit_aa_actived = UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", "Legit AA Key");
    var fakeduck_actived = UI.IsHotkeyActive("Anti-Aim", "Extra", "Fake duck");
    var slow_actived = UI.IsHotkeyActive("Anti-Aim", "Extra", "Slow walk");
    var force_baim_actived = UI.IsHotkeyActive("Rage", "GENERAL", "General", "Force body aim");
    var force_safe_actived = UI.IsHotkeyActive("Rage", "GENERAL", "General", "Force safe point");
    var y_plus = 0;

    // Menu No-render

    if (!World.GetServerString()) 
    {
        return;
    }

    // Angle Indicator

    if (UI.GetValue("Anti-Aim", "Fake angles", "Enabled", true) &! legit_aa_actived)
    {
        if (lby_type == 0) // Normal
        {
            Render.String(screen_half_x - 22, screen_half_y + 45, 0, "Normal", [177, 151, 255, 200], 3);
        } 
        else if (lby_type == 1) // Opposite
        {
            Render.String(screen_half_x - 22, screen_half_y + 45, 0, "Opposite", [177, 151, 255, 200], 3);
        } 
        else if (lby_type == 2) // Sway
        {
            Render.String(screen_half_x - 22, screen_half_y + 45, 0, "Sway", [177, 151, 255, 200], 3);
        }
    } 
    else if (UI.GetValue("Anti-Aim", "Fake angles", "Enabled", true) && legit_aa_actived)
    {
        Render.String(screen_half_x - 24, screen_half_y + 45, 0, "Legit AA on Key", [177, 151, 255, 200], 3);
    } 
    else 
    {
        Render.String(screen_half_x - 24, screen_half_y + 45, 0, "Desyncless", [177, 151, 255, 200], 3);
    }

    // Inverter Indicator

    if (UI.IsHotkeyActive("Anti-Aim", "Fake Angles", "Inverter") ) 
    {
        Render.String(screen_half_x - 30, screen_half_y + 56, 0, "Left desync", [155, 151, 255, 200], 3);
    } else 
    {
        Render.String(screen_half_x - 30, screen_half_y + 56, 0, "Right desync", [155, 151, 255, 200], 3);
    }

    // Doubletap Indicator

    if (dt_actived && (dt_charge < 1)) 
    {
        Render.String(screen_half_x - 49, screen_half_y + 67, 0, "Doubletap" + " [Reloading " + dt_charge + " ]" , [50, 50, 177, 200], 3);
    } 
    else if (dt_actived && (dt_charge == 1)) 
    {
        Render.String(screen_half_x - 49, screen_half_y + 67, 0, "Doubletap" + " [Reloaded]", [15, 177, 15, 200], 3);
    } 
    else if (!dt_actived) 
    {
        Render.String(screen_half_x - 49, screen_half_y + 67, 0, "Doubletap" + " [Disabled]", [155, 15, 15, 200], 3);
    }

    // Force baim & safe points

    if (force_baim_actived) 
    {
        y_plus = y_plus + 11;
        Render.String(screen_half_x - 28, screen_half_y + 67 + y_plus, 0, "Force BAIM" , [50, 190, 50, 200], 3);
    }

    if (force_safe_actived) 
    {
        y_plus = y_plus + 11;
        Render.String(screen_half_x - 28, screen_half_y + 67 + y_plus, 0, "Force SAFE" , [50, 190, 50, 200], 3);
    }

    // Slow Walk Indicator

    if (slow_actived) 
    {
        y_plus = y_plus + 11;
        Render.String(screen_half_x - 24, screen_half_y + 67 + y_plus, 0, "Slow Walk" , [15, 170, 190, 170], 3);
    }

    // Fake Duck Indicator

    if (fakeduck_actived) 
    {
        y_plus = y_plus + 11;
        Render.String(screen_half_x - 24, screen_half_y + 67 + y_plus, 0, "Fake Duck" , [15, 120, 190, 170], 3);
    }

    // Damage Override Indicator

    if (weapon_name == "dual berretas" || weapon_name == "five seven" || weapon_name == "glock 18" || weapon_name == "tec 9" || weapon_name == "p250" || weapon_name == "usp s" || weapon_name == "cz75 auto") 
    {
        dmg_info = UI.GetValue("Rage", "PISTOL", "Targeting", "Minimum damage");
    }
    if (weapon_name == "r8 revolver" || weapon_name == "desert eagle") 
    {
        dmg_info = UI.GetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage");
    }
    if (weapon_name == "ssg 08") 
    {
        dmg_info = UI.GetValue("Rage", "SCOUT", "Targeting", "Minimum damage");
    }
    if (weapon_name == "awp") 
    {
        dmg_info = UI.GetValue("Rage", "AWP", "Targeting", "Minimum damage");
    }
    if (weapon_name == "scar 20" || weapon_name == "g3sg1") 
    {
        dmg_info = UI.GetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage");
    }
    if (weapon_name == "knife") 
    {
        dmg_info = 0 + " (It's Knife)";
    }

    if (dmg_override_actived) 
    {
        y_plus = y_plus + 11;
        dmg_text_inf = "Damage Override [ " + dmg_info.toString() + " ]"
        Render.String(screen_half_x - 53, screen_half_y + 67 + y_plus, 0, dmg_text_inf, [255, 190, 15, 200], 3);
    }

    // Onshot Indicator

    if (onshot_actived) 
    {
        y_plus = y_plus + 11;
        Render.String(screen_half_x - 17, screen_half_y + 67 + y_plus, 0, "Onshot", [200, 255, 15, 200], 3);
    }
}

// -- Low Delta

function low_delta()
{
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Low delta", true)) 
    {
        actived_sw = UI.IsHotkeyActive("Anti-Aim", "Extra", "Slow walk")
        actived_inv_aa = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter")
    
        if (actived_sw)
        {
            if (save_lowdelta)
            {
                jitter_backup = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Jitter offset");
                yaw_backup = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset");
                adir_backup = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction");
                save_lowdelta = false;
            }
            if (actived_inv_aa == true) 
            {
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 10);
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Jitter offset", 0);
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction", false);
                AntiAim.SetOverride(1);
                AntiAim.SetFakeOffset(0);
                AntiAim.SetRealOffset(28);
            } else 
            {
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", -10);
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Jitter offset", 0);
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction", false);
                AntiAim.SetOverride(1);
                AntiAim.SetFakeOffset(0);
                AntiAim.SetRealOffset(-28); 
            }
        } else
        {
            if (!save_lowdelta)
            {
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Jitter offset", jitter_backup);
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", yaw_backup);
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction", adir_backup);
                save_lowdelta = true;
            }
            AntiAim.SetOverride(0);
        }
    } else 
    {
        AntiAim.SetOverride(0);
    }
}

// -- Watermark --

function watermark() 
{
    water_status = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Draw Watermark")
    water_name_status = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Custom Username")

    if (water_status == true) 
    {
        UI.SetEnabled("Misc", "JAVASCRIPT", "Script Items", "Custom Username", true);
        UI.SetEnabled("Misc", "JAVASCRIPT", "Script Items", "Watermark Color", true);
        UI.SetEnabled("Misc", "JAVASCRIPT", "Script Items", "Transparency", true);
        UI.SetValue("Misc", "PERFORMANCE & INFORMATION", "Information", "Watermark" , false);

        if(!World.GetServerString()) 
        {
            return;
        }

        var color_wm = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Watermark Color");

        var tickrate = Globals.Tickrate().toString();

        var ping = Math.round(Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing")).toString();
        
        if (water_name_status == true) 
        {
            UI.SetEnabled("Misc", "JAVASCRIPT", "Script Items", "Username", true);
            username = UI.GetString("Misc", "JAVASCRIPT", "Script Items", "Username");
        } else 
        {
            UI.SetEnabled("Misc", "JAVASCRIPT", "Script Items", "Username", false);
            username = "lovr3x & revcy"
        }

        var today = new Date();
        var hours1 = today.getHours();
        var minutes1 = today.getMinutes();
        var seconds1 = today.getSeconds();
        var hours = hours1 <= 9 ? "0"+ hours1 + " : " : hours1 + " : ";
        var minutes = minutes1 <= 9 ? "0" + minutes1 + " : " : minutes1 + " : ";
        var seconds = seconds1 <= 9 ? "0" + seconds1 : seconds1;

        color_wm = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Watermark Color");

        gamerules = Entity.GetGameRulesProxy();
        is_valve_server = Entity.GetProp( gamerules, "CCSGameRulesProxy", "m_bIsValveDS" );
        var server_info = World.GetServerString().toString();
        if (is_valve_server == true) 
        {
            server_info = "Valve Server"
        } else if (server_info == "local server")
        {
            server_info = "Local Server"
        } 

        var font = Render.AddFont("Verdana", 7, 400);
        var text = "Onetap.com | " + server_info + " | " + username + " | delay: " + ping + "ms | " + tickrate + "tick | " + hours + minutes + seconds;
        
        var w = Render.TextSizeCustom(text, font)[0] + 8;
        var x = Global.GetScreenSize()[0];

        x = x - w - 15;

        Render.FilledRect(x, 10, w, 2, [ color_wm[0], color_wm[1], color_wm[2], color_wm[3] ]);
        Render.FilledRect(x, 12, w, 18, [ 17, 17, 17, 0 ]);
        Render.StringCustom(x + 4, 10 + 4, 0, text, [ 255, 255, 255, 255 ], font);
    } else 
    {
        UI.SetEnabled("Misc", "JAVASCRIPT", "Script Items", "Watermark Color", false);
        UI.SetEnabled("Misc", "JAVASCRIPT", "Script Items", "Username", false);
    }
}

function unloading() 
{
    UI.SetValue("Misc", "PERFORMANCE & INFORMATION", "Information", "Watermark" , true);
    UI.SetValue("Misc", "GENERAL", "Miscellaneous", "Hidden cvars", false);
    UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Aspect Ratio", false);
}

// -- Callback's --

Cheat.RegisterCallback("FrameStageNotify", "rev_pingspike");
Cheat.RegisterCallback("Draw", "main_aa")
Cheat.RegisterCallback("CreateMove", "low_delta");
Cheat.RegisterCallback("FrameStageNotify", "aspectration");
Cheat.RegisterCallback("Draw", "mod_clantag");
Cheat.RegisterCallback("CreateMove", "legit_aa");
Cheat.RegisterCallback("player_hurt", "ragebotLogs_player_damage");
Cheat.RegisterCallback("ragebot_fire", "ragebotLogs");
Cheat.RegisterCallback("Draw", "watermark");
Cheat.RegisterCallback("Unload", "unloading");
Global.RegisterCallback("CreateMove", "weapons_dmg_override");
Cheat.RegisterCallback("Draw", "revolt_indicators");

